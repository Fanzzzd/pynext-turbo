# Pynext-Turbo Deployment Guide

This guide provides an overview of the different strategies available for deploying your Pynext-Turbo application. Each strategy has its own trade-offs in terms of cost, complexity, and scalability.

Choose the guide that best fits your needs:

### Deployment Options

1.  **[Hybrid Cloud (Recommended)](./deploy-hybrid.md)**
    - **What it is:** The most robust and scalable approach, leveraging best-in-class services for each part of the stack.
    - **Frontend (Next.js):** Deployed to **Vercel**.
    - **Backend (FastAPI) & Database (PostgreSQL):** Deployed to **Render**.
    - **Best for:** Production applications that require high performance, scalability, and reliability.

2.  **[Self-Hosted with Docker](./deploy-self-host.md)**
    - **What it is:** Deploy all services to a single server (e.g., a VPS) using Docker Compose and an Nginx reverse proxy.
    - **Best for:** Developers who want full control over their infrastructure or need to host the application in a specific environment.

3.  **[All-in-One Vercel (Advanced)](./deploy-vercel-all-in-one.md)**
    - **What it is:** Deploys both the Next.js frontend and the FastAPI backend as serverless functions on Vercel, using a third-party database.
    - **Best for:** Projects where a serverless architecture is a primary requirement. Note that this approach requires significant project restructuring.
