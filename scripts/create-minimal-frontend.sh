#!/usr/bin/env bash
# Create a minimal frontend into `frontend-assets/` for quick deploy.

set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

echo "Creating minimal frontend in ./frontend-assets"
rm -rf frontend-assets
mkdir -p frontend-assets

cp -a frontend-assets/index.html frontend-assets/index.html

echo "Files in frontend-assets:" 
ls -la frontend-assets

echo "You can now run: dfx start --background --clean && dfx deploy frontend"
