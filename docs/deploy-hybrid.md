# Hybrid Cloud Deployment: Vercel + Render

This is the recommended deployment strategy for most production applications. It combines the strengths of Vercel for frontend hosting and Render for backend services.

### Prerequisites

- A Git repository (GitHub, GitLab, etc.) with your project code pushed.
- A [Render](https://render.com/) account.
- A [Vercel](https://vercel.com/) account.
- A domain name (optional but recommended for production).

---

### Step 1: Deploy Backend and Database to Render

Render's "Blueprint" feature makes this incredibly simple. It will read the `render.yaml` file in your repository and set up all the necessary services.

1.  **Create a Blueprint in Render:**
    - In your Render dashboard, go to **Blueprints** and click **New Blueprint Instance**.
    - Connect your Git repository. Render will automatically detect and parse `render.yaml`.
    - Approve the plan. Render will begin provisioning a PostgreSQL database and a web service for your API. The initial deployment might take a few minutes.

2.  **Get Your API URL:**
    - Once the deployment completes, navigate to your `pynext-turbo-api` service in the Render dashboard.
    - Copy its public URL (it will look something like `https://pynext-turbo-api-xyz.onrender.com`).

---

### Step 2: Deploy Frontend to Vercel

1.  **Create a New Project in Vercel:**
    - In your Vercel dashboard, click **Add New...** > **Project**.
    - Import your Git repository.
    - Vercel will detect `vercel.json` and automatically configure the Root Directory to `apps/web`.

2.  **Configure Environment Variables:**
    - Before deploying, go to the project's **Settings** > **Environment Variables**.
    - Add the following variable:
      - **Key:** `NEXT_PUBLIC_API_URL`
      - **Value:** The API URL you copied from Render in the previous step.

3.  **Deploy:**
    - Click **Deploy**. Vercel will build and deploy your Next.js application.
    - Once finished, copy your Vercel deployment's domain (e.g., `https://my-pynext-app.vercel.app`).

---

### Step 3: Update API CORS Settings

To allow your Vercel frontend to communicate with your Render backend, you must update the API's Cross-Origin Resource Sharing (CORS) settings.

1.  **Return to Render:**
    - Go back to your `pynext-turbo-api` service's **Environment** settings.
    - Find the `CORS_ORIGINS` environment variable.
    - Update its value with your Vercel app's domain, formatted as a JSON array:
      - **Key:** `CORS_ORIGINS`
      - **Value:** `["https://my-pynext-app.vercel.app"]`
    - Save the changes. Render will automatically trigger a new deployment for your API with the updated settings.

Your application is now live, fully deployed using a professional, scalable architecture.
