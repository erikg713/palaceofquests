# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

###########################
# Build Stage
###########################
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies (npm ci for deterministic builds)
# Use bind mounts for package.json and package-lock.json for caching
COPY --link package.json ./
# Only copy package-lock.json if it exists (for npm ci)
# If you use yarn or pnpm, adjust accordingly
# If you don't have a lock file, consider adding one for reproducibility
# (We do NOT copy .env or any secret files)
# If you want to support both, you can add:
# COPY --link package-lock.json* ./
# But for now, we only copy package.json as no lock file is present in the provided structure

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the application (excluding .env, .env.local, .git, etc. via .dockerignore)
COPY --link . .

# Build the app (Vite build)
RUN --mount=type=cache,target=/root/.npm \
    npm run build

###########################
# Production Stage
###########################
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy built app and production dependencies only
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

EXPOSE 4173

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
