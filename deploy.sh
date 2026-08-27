#!/bin/bash
set -e

echo "==> Pulling latest code..."
git stash
git pull origin main

echo "==> Building Docker image..."
docker build -t dmix-writes .

echo "==> Restarting container..."
docker stop dmix-writes 2>/dev/null || true
docker rm dmix-writes 2>/dev/null || true

docker run -d \
  --name dmix-writes \
  --restart unless-stopped \
  -p 3002:3000 \
  dmix-writes

echo "==> Deployed successfully to http://localhost:3002"