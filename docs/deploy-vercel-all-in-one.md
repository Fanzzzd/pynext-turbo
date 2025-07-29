# All-in-One Vercel Deployment (Advanced)

This strategy deploys both the Next.js frontend and the FastAPI backend as serverless functions on Vercel.

**⚠️ Important:** This approach deviates significantly from the default monorepo structure of Pynext-Turbo. It simplifies infrastructure management by keeping everything on Vercel but increases the complexity of local development and database migrations. It is recommended only for users comfortable with serverless architectures and the required project restructuring.

### Prerequisites

- A Git repository with your project code.
- A Vercel account.
- A cloud-based PostgreSQL database provider (e.g., [Vercel Postgres](https://vercel.com/postgres), [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or a [Render](https://render.com) database). Vercel does not host stateful services like databases.

---

### Step 1: Restructure the Project

You must merge the `api` and `web` apps into a single Vercel-deployable unit.

1.  **Move API Source:**
    - Create a new directory: `apps/web/api/`.
    - Move the contents of `apps/api/src/` into this new `apps/web/api/` directory.
    - Your main FastAPI file (`apps/api/src/main.py`) should now be at `apps/web/api/index.py`. Vercel specifically looks for an `index.py` or `handler.py` file to define a serverless function.

2.  **Combine Dependencies:**
    - Create a `requirements.txt` file in `apps/web/`.
    - Copy all dependencies from `apps/api/pyproject.toml` into `apps/web/requirements.txt`. Vercel uses this file to install Python packages.

3.  **Update `vercel.json`:**
    - The existing `vercel.json` is configured only for Next.js. You need to replace it with one that handles both Next.js and Python serverless functions.
    - In `apps/web/`, replace the contents of `vercel.json` with the following:
      ```json
      {
        "builds": [
          { "src": "api/index.py", "use": "@vercel/python" },
          { "src": "next.config.ts", "use": "@vercel/next" }
        ],
        "routes": [
          { "src": "/api/(.*)", "dest": "api/index.py" },
          { "src": "/(.*)", "dest": "/$1" }
        ]
      }
      ```
    - You can now delete the root `vercel.json` file. The one inside `apps/web` is what Vercel will use since the root directory is set to `apps/web`.

4.  **Update Code Paths:**
    - Your FastAPI application will now be running at the root of the project from Vercel's perspective. You may need to adjust imports within your Python code.
    - The API client generation script will also need to be adapted to this new structure if you wish to keep it.

---

### Step 2: Deploy to Vercel

1.  Push your restructured code to Git.
2.  Create a new Vercel project and import the repository.
3.  **Set the Root Directory to `apps/web`** in the project settings.
4.  Configure Environment Variables:
    - `DATABASE_URL`: The full connection string for your cloud database.
    - `NEXT_PUBLIC_API_URL`: This will be your Vercel deployment's full URL (e.g., `https://my-pynext-app.vercel.app`).
    - `CORS_ORIGINS`: `["https://my-pynext-app.vercel.app"]` (or your domain).

Vercel will detect both `next.config.ts` and `api/index.py` and deploy them as a single project.

---

### Step 3: Handling Database Migrations

Running Alembic migrations becomes a manual process because you cannot run arbitrary shell commands on Vercel's infrastructure.

You must run migrations from your local machine, connected to the production database.

1.  **Set the production database URL locally:**
    ```bash
    export DATABASE_URL="your_production_database_url_here"
    ```
2.  **Run the migration command:**
    ```bash
    # Assuming you have also moved alembic.ini and the alembic/ directory
    # to your new `apps/web` root.
    cd apps/web
    uv run alembic upgrade head
    ```
    **⚠️ Be extremely careful when running commands against a production database.**
