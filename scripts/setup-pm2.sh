#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Setting up pm2 for HeliosHash web dev server..."

# Install pm2 if missing
if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 not found — installing globally via npm..."
  npm install -g pm2
fi

mkdir -p "$ROOT_DIR/apps/web/logs"

echo "Starting pm2 process from apps/web/ecosystem.config.cjs"
pm2 start "$ROOT_DIR/apps/web/ecosystem.config.cjs" --only helioshash-web || true

echo "Saving pm2 process list"
pm2 save

echo "Registering pm2 to startup on this system"
# The following prints the needed command — run it as root if required
STARTUP_CMD=$(pm2 startup | sed -n '1,3p') || true
echo "$STARTUP_CMD"

echo "Done. Use 'pm2 status' to confirm, and 'pm2 logs helioshash-web' to tail logs."
