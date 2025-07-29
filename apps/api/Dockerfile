# --- Builder Stage ---
# Use a full Python image to build dependencies
FROM python:3.11-slim as builder

WORKDIR /app

# Install uv for dependency management
RUN pip install uv

# Copy only dependency-related files
COPY pyproject.toml uv.lock ./

# Install dependencies into a virtual environment
# This caches the dependencies in a separate layer
RUN uv venv && . .venv/bin/activate && uv sync --frozen

# --- Runtime Stage ---
# Use a slim image for the final application
FROM python:3.11-slim

# Set a non-root user for security
RUN useradd --create-home appuser
USER appuser
WORKDIR /home/appuser/app

# Copy the virtual environment from the builder stage
COPY --chown=appuser:appuser --from=builder /app/.venv ./.venv
# Copy the application source code
COPY --chown=appuser:appuser src/ ./src/

# Make the python from the venv the default
ENV PATH="/home/appuser/app/.venv/bin:$PATH"

EXPOSE 8000

# Use Gunicorn as the production server with Uvicorn workers
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "4", "-b", "0.0.0.0:8000", "src.main:app"]