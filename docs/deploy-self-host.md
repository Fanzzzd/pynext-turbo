# Self-Hosted Deployment with Docker

This option is for deploying all services to a single server (e.g., a VPS from DigitalOcean, Linode, AWS EC2). It uses the production Docker Compose setup and an Nginx reverse proxy.

### Prerequisites

- A server with Docker and Docker Compose installed.
- A container registry (like Docker Hub) to host your images.
- Your domain name pointed to your server's IP address.

---

### Step 1: Build and Push Docker Images

The production Docker Compose setup (`docker-compose.prod.yml`) is designed to use pre-built images from a container registry.

1.  **Build the API image:**

    ```bash
    # Run from the project root
    docker build -t your-registry/pynext-api:latest -f apps/api/Dockerfile .
    ```

2.  **Build the Web image:**

    ```bash
    # Run from the project root
    docker build -t your-registry/pynext-web:latest -f apps/web/Dockerfile.prod .
    ```

3.  **Push the images to your registry:**
    ```bash
    docker push your-registry/pynext-api:latest
    docker push your-registry/pynext-web:latest
    ```
    _Replace `your-registry` with your container registry's username or URL._

---

### Step 2: Prepare the Server

1.  **Clone your repository onto the server:**

    ```bash
    git clone https://github.com/your-repo/pynext-turbo.git
    cd pynext-turbo
    ```

2.  **Configure Production Environment:**
    - In `docker-compose.prod.yml`, update the `image` names for the `api` and `web` services to match the ones you just pushed.
    - Create production `.env` files by copying the examples:
      ```bash
      cp apps/api/.env.example apps/api/.env
      cp apps/web/.env.example apps/web/.env
      ```
    - **Edit `apps/api/.env`:**
      - Update the `DATABASE_URL` to use a strong, unique password. The `docker-compose.prod.yml` file will pass these credentials to the Postgres container.
    - **Edit `apps/web/.env`:**
      - Set `NEXT_PUBLIC_API_URL` to point to the Nginx reverse proxy path for the API. The provided `nginx.conf` uses `/api`, so you should set: `NEXT_PUBLIC_API_URL=/api`.

3.  **Review Nginx Configuration:**
    - Open `nginx/nginx.conf`.
    - Replace `server_name localhost;` with your actual domain name.
    - For a production setup, it's highly recommended to configure SSL/TLS using a service like Let's Encrypt. This configuration is not included but is a critical step.

---

### Step 3: Run the Application

From your project root on the server, start all services in detached mode:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

This command will:

- Pull your pre-built images from the registry.
- Start the database, API, web frontend, and Nginx proxy containers.
- The API container will automatically run database migrations before starting the web server.

Your application should now be accessible at your domain. Nginx handles routing traffic: `/api/*` goes to the FastAPI backend, and all other requests go to the Next.js frontend.
