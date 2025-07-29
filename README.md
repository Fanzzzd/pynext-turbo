# Pynext-Turbo

A modern, type-safe, full-stack monorepo template using Next.js, FastAPI, and PostgreSQL. Inspired by the developer experience of `create-t3-turbo`.

## 🚀 Features

- ⚡ **End-to-End Type Safety**: From your database schema with SQLModel to your React components with a generated API client.
- 🎯 **tRPC-like Developer Experience**: The API client is automatically regenerated whenever you change your FastAPI backend code. No manual steps required during development!
- 📦 **Monorepo with Turborepo**: High-performance build system for managing complex monorepos.
- 🔥 **Modern Tech Stack**: Next.js 15, FastAPI, SQLModel, TanStack Query, and Tailwind CSS.
- 🗄️ **Production-Ready Database**: PostgreSQL with Alembic for robust database migrations.
- 🛠️ **Superior Developer Experience**: Pre-configured with Prettier, ESLint, VSCode settings, and a streamlined command-line interface.
- 🐳 **Dockerized Services**: Consistent development and production environments with Docker Compose.

## ⚡ Getting Started

This project is designed for a seamless developer experience.

1.  **Prerequisites**: Ensure you have [Docker](https://www.docker.com/), [pnpm](https://pnpm.io/installation), and [uv](https://github.com/astral-sh/uv) (`pip install uv`) installed.

2.  **Clone & Setup**:

    ```bash
    git clone https://github.com/your-repo/pynext-turbo.git
    cd pynext-turbo
    ./init_dev.sh
    ```

    The setup script handles everything: installs dependencies, sets up `.env` files, starts the database, runs migrations, and generates the API client.

3.  **Start Developing**:
    ```bash
    pnpm dev
    ```

## 📚 Documentation

For more details on the project structure, development workflow, and deployment, please refer to our comprehensive documentation:

- **[💻 Development Guide](./docs/development.md)**: Learn about database migrations, API client generation, and the project structure.
- **[🚀 Deployment Guide](./docs/deployment.md)**: A complete guide to deploying your application.

## 📁 Project Structure

```filetree
.
├── apps
│   ├── api/          # FastAPI backend
│   └── web/          # Next.js frontend
├── docs/             # Project documentation
├── packages
│   ├── api-client/   # Auto-generated API client
│   ├── eslint-config-custom/
│   ├── tsconfig/
│   └── ui/           # Shared React components
├── init_dev.sh       # Development environment setup script
├── docker-compose.yml
└── turbo.json
```
