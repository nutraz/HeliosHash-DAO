#!/usr/bin/env bash
set -euo pipefail

# Build & export the Next.js app and deploy to the local dfx asset canister `frontend`.
# Usage: ./scripts/deploy-web-canister.sh

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB_DIR="$REPO_ROOT/apps/web"
ASSETS_DIR="$REPO_ROOT/src/frontend/assets"

echo "1) Ensuring asset output directory exists: $ASSETS_DIR"
rm -rf "$ASSETS_DIR"
mkdir -p "$ASSETS_DIR"

echo "2) Building web app"
cd "$WEB_DIR"
pnpm install --frozen-lockfile
pnpm build

echo "3) Locating exported static files (Next.js build output)"
echo "   Note: Next's 'export' command may be removed in newer versions. We'll look for common export output locations after 'pnpm build'."
# Prepare temporary out dir then copy exported output from known locations.
TMP_OUT="$WEB_DIR/out"
rm -rf "$TMP_OUT"
mkdir -p "$TMP_OUT"

# Try the legacy `next export` first (some projects still support it)
if pnpm exec -- next export -o "$TMP_OUT" 2>/dev/null; then
   echo "-> Exported using 'next export' to $TMP_OUT"
else
   echo "-> 'next export' not available or failed; checking known build output locations..."
   # Ensure build has been run (pnpm build earlier in script).
   # Check common Next export/output folders in order of likelihood.
   if [ -d "$WEB_DIR/out" ] && [ "$(ls -A $WEB_DIR/out)" ]; then
      echo "-> Found exported files in $WEB_DIR/out"
      cp -r "$WEB_DIR/out/"* "$TMP_OUT/"
   elif [ -d "$WEB_DIR/.next/export" ] && [ "$(ls -A $WEB_DIR/.next/export)" ]; then
      echo "-> Found exported files in $WEB_DIR/.next/export"
      cp -r "$WEB_DIR/.next/export/"* "$TMP_OUT/"
   elif [ -d "$WEB_DIR/.next/output/static" ] && [ "$(ls -A $WEB_DIR/.next/output/static)" ]; then
      echo "-> Found exported files in $WEB_DIR/.next/output/static"
      cp -r "$WEB_DIR/.next/output/static/"* "$TMP_OUT/"
   elif [ -d "$WEB_DIR/.next/static" ] && [ "$(ls -A $WEB_DIR/.next/static)" ]; then
      echo "-> Found static files in $WEB_DIR/.next/static (note: may not include HTML pages)"
      cp -r "$WEB_DIR/.next/static/"* "$TMP_OUT/"
   else
      echo "Error: Could not find exported static files after build. Check that the app is exportable or adjust the script to match your Next.js output." >&2
      exit 1
   fi
fi

echo "4) Copying exported assets into dfx assets path: $ASSETS_DIR"
rm -rf "$ASSETS_DIR"/*
# Copy only public/static files — avoid copying generated TypeScript 'types' and server vendor chunks
rsync -av --exclude='types/' --exclude='server/' --exclude='**/*.map' --exclude='**/*.ts' "$TMP_OUT"/ "$ASSETS_DIR" || true

echo "5) Deploying to local dfx replica (frontend canister)"
cd "$REPO_ROOT"
dfx canister create --no-wallet frontend || true
dfx build frontend
dfx deploy frontend

CANISTER_ID=$(dfx canister id frontend)
echo "Frontend deployed to canister id: $CANISTER_ID"
echo "Open in local browser: http://$CANISTER_ID.localhost:8000/"

echo "Done. If you see 404s, check that the exported output contains an index.html at the root of exported files." 
