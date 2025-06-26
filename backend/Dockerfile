# syntax=docker/dockerfile:1

# --- Base image ---
FROM python:3.9-slim AS base

# Set workdir
WORKDIR /app

# --- Builder stage: install dependencies in a venv ---
FROM base AS builder

# Install system dependencies (for pip, psycopg2, etc.)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt only (for better cache usage)
COPY --link requirements.txt ./

# Create venv and install dependencies using pip cache
RUN python -m venv /app/.venv \
    && . /app/.venv/bin/activate \
    && pip install --upgrade pip \
    && pip install --no-warn-script-location -r requirements.txt

# Copy the rest of the application code (excluding .env and secrets)
COPY --link . .

# --- Final stage ---
FROM base AS final

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy app source and venv from builder
COPY --from=builder /app /app
COPY --from=builder /app/.venv /app/.venv

# Set environment variables
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set permissions
RUN chown -R appuser:appgroup /app
USER appuser

# Expose the port FastAPI/Flask will run on (default 4000, but also 5000 for Flask fallback)
EXPOSE 4000 5000

# Default command: run FastAPI app if present, else fallback to Flask app.py
CMD ["sh", "-c", "if [ -f flask_app/main.py ]; then exec uvicorn flask_app.main:app --host 0.0.0.0 --port 4000; elif [ -f app.py ]; then exec python app.py; else exec uvicorn app.main:app --host 0.0.0.0 --port 4000; fi"]
