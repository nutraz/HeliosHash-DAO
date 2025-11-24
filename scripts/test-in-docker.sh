#!/usr/bin/env bash
set -e

IMAGE="mcr.microsoft.com/playwright:v1.49.1-jammy"

echo "Running Playwright tests inside Docker container using image: $IMAGE"

docker run --rm -it \
  --privileged \
  -u root \
  -v "$PWD":/work \
  -w /work/apps/web \
  $IMAGE \
  bash -lc "
    echo 'Installing pnpm (no corepack)...'
    npm install -g pnpm

    echo 'Installing dependencies...'
    pnpm install --no-frozen-lockfile

    echo 'Installing Playwright browsers...'
    npx playwright install --with-deps

    echo 'Running E2E tests...'
    pnpm test:e2e
  "
