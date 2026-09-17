#!/bin/bash
set -e

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "==> Working tree has uncommitted changes. Commit or stash them before deploying." >&2
  exit 1
fi

echo "==> Pulling latest code..."
git pull --ff-only origin main

if [ -z "${SITE_URL:-}" ] && [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

if [ -z "${SITE_URL:-}" ]; then
  echo "==> SITE_URL is not set. Export it or add it to .env (see .env.example)." >&2
  exit 1
fi

echo "==> Building Docker image..."
docker build --build-arg SITE_URL="$SITE_URL" -t dmix-writes .

echo "==> Restarting container..."
docker stop dmix-writes 2>/dev/null || true
docker rm dmix-writes 2>/dev/null || true

docker run -d \
  --name dmix-writes \
  --restart unless-stopped \
  -p 3002:3000 \
  -e SITE_URL="$SITE_URL" \
  -v dmix-likes:/app/data \
  dmix-writes

echo "==> Deployed successfully to http://localhost:3002"