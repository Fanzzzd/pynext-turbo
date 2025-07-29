#!/bin/bash
# Pynext-Turbo Development Environment Initialization Script

# This script must be run from the project root
if [ ! -f "pnpm-workspace.yaml" ]; then
    echo "This script must be run from the project root."
    exit 1
fi

echo "🚀 Initializing Pynext-Turbo development environment..."

# Check for dependencies
for cmd in pnpm uv docker; do
    if ! command -v $cmd &> /dev/null; then
        echo "❌ $cmd is not installed. Please install it and try again."
        exit 1
    fi
done

if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker daemon is not running. Please start Docker and try again."
  exit 1
fi

# Create .env files from examples if they don't exist
if [ ! -f apps/api/.env ]; then
    echo "📄 apps/api/.env file not found. Copying from apps/api/.env.example..."
    cp apps/api/.env.example apps/api/.env
fi
if [ ! -f apps/web/.env ]; then
    echo "📄 apps/web/.env file not found. Copying from apps/web/.env.example..."
    cp apps/web/.env.example apps/web/.env
fi

# Load environment variables from apps/api/.env for database setup
set -a
# shellcheck disable=SC1091
source apps/api/.env
set +a

# --- Start of database setup logic ---
echo "🐘 Setting up database..."

DB_USER=$(echo "$DATABASE_URL" | awk -F'//' '{print $2}' | awk -F':' '{print $1}')
DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
DB_PORT=$(echo "$DATABASE_URL" | awk -F':' '{print $4}' | awk -F'/' '{print $1}')
DB_NAME=$(echo "$DATABASE_URL" | awk -F'/' '{print $4}')
DB_CONTAINER_NAME="${DB_NAME}-postgres"

# Check if port is in use by another process
if lsof -i -P -n | grep -q ":$DB_PORT (LISTEN)"; then
    if ! docker ps -q -f name="^${DB_CONTAINER_NAME}$" | grep -q .; then
        echo "❗️ Port $DB_PORT is already in use by another process."
        exit 1
    fi
fi

if [ "$(docker ps -q -f name="^${DB_CONTAINER_NAME}$")" ]; then
  echo "✅ Database container '$DB_CONTAINER_NAME' is already running."
elif [ "$(docker ps -q -a -f name="^${DB_CONTAINER_NAME}$")" ]; then
  docker start "$DB_CONTAINER_NAME"
  echo "✅ Existing database container '$DB_CONTAINER_NAME' started."
else
  echo "Creating and starting new database container '$DB_CONTAINER_NAME'..."

  if [ "$DB_PASSWORD" = "postgres" ]; then
    echo "❗️ You are using the default database password 'postgres'."
    read -p "Should we generate a random password for you? [y/N]: " -r REPLY
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      NEW_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
      # This sed command is compatible with both macOS (BSD) and Linux (GNU)
      sed -i.bak "s/postgres:postgres@/postgres:$NEW_PASSWORD@/g" apps/api/.env && rm apps/api/.env.bak
      DB_PASSWORD=$NEW_PASSWORD
      echo "✅ Random password generated and updated in apps/api/.env file."
      
      # Reload .env to get the new DATABASE_URL for subsequent steps
      echo "Reloading environment variables..."
      set -a
      # shellcheck disable=SC1091
      source apps/api/.env
      set +a

      # Since password changed, resetting database volume to ensure a fresh start
      echo "🔄 Password changed, resetting database volume..."
      docker volume rm "pynext_turbo_postgres_data" > /dev/null 2>&1 || true
    fi
  fi

  docker run -d \
    --name "$DB_CONTAINER_NAME" \
    -e POSTGRES_USER="$DB_USER" \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB="$DB_NAME" \
    -p "$DB_PORT":5432 \
    -v "$(pwd)/apps/api/init.sql:/docker-entrypoint-initdb.d/init.sql" \
    -v "pynext_turbo_postgres_data:/var/lib/postgresql/data" \
    postgres:15

  if [ $? -ne 0 ]; then
    echo "❌ Failed to start database container."
    exit 1
  fi
  echo "✅ Database container created."
fi

echo "⏳ Waiting for PostgreSQL to become healthy..."
max_wait=30
waited=0

# Loop until `pg_isready` is successful or timeout
until docker exec "$DB_CONTAINER_NAME" pg_isready -U "$DB_USER" -q 2>/dev/null; do
  if [ $waited -ge $max_wait ]; then
    echo ""
    echo "❌ PostgreSQL did not become ready in $max_wait seconds."
    docker logs "$DB_CONTAINER_NAME"
    exit 1
  fi
  printf '.'
  sleep 2
  waited=$((waited + 2))
done

echo ""
echo "✅ PostgreSQL is ready to accept connections."

# --- End of database setup logic ---

echo "📦 Installing Node.js dependencies..."
pnpm install

echo "🐍 Installing Python dependencies..."
pnpm postinstall

MIGRATIONS_DIR="apps/api/alembic/versions"
mkdir -p "$MIGRATIONS_DIR"

# Check for python migration files, ignoring other files like .DS_Store on macOS
if [ -z "$(find "$MIGRATIONS_DIR" -maxdepth 1 -type f -name '*.py')" ]; then
    echo "📝 No migrations found. Generating initial database migration..."
    pnpm db:generate "initial migration"
    if [ $? -ne 0 ]; then
        echo "❌ Failed to generate initial migration."
        exit 1
    fi
else
    echo "✅ Migrations already exist. Skipping generation."
fi

echo "🔧 Running database migrations..."
pnpm db:migrate

echo "🧬 Generating API client..."
pnpm generate:client

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 To start developing, run:"
echo "   pnpm dev"
echo ""
echo "📚 Access the application:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API docs: http://localhost:8000/docs"
echo ""
echo "🔄 When the API changes, the client will regenerate automatically."
echo "  If you need to do it manually, run: pnpm generate:client"
echo ""
echo "Enjoy type-safe full-stack development! 🎉"