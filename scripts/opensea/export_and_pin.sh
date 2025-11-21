#!/usr/bin/env bash
set -euo pipefail

# Export metadata and pin to web3.storage (or run in dry-run mode)
# Requires: WEB3_STORAGE_TOKEN in env to pin. If absent, runs in dry-run mode.

OUTDIR=${1:-build/opensea}
FIXTURES=${2:-scripts/demo/members.json}

echo "Rendering metadata from $FIXTURES to $OUTDIR"
node scripts/opensea/render_metadata.js "$FIXTURES" "$OUTDIR"

if [ -z "${WEB3_STORAGE_TOKEN:-}" ]; then
  echo "WEB3_STORAGE_TOKEN not set — running in dry-run mode. No pinning will occur."
  exit 0
fi

echo "Pinning files in $OUTDIR to web3.storage"
for f in "$OUTDIR"/*.json; do
  echo "Pinning $f..."
  # using curl to upload file(s). web3.storage supports direct file uploads
  res=$(curl -s -X POST "https://api.web3.storage/upload" \
    -H "Authorization: Bearer $WEB3_STORAGE_TOKEN" \
    -H "Accept: application/json" \
    -F "file=@${f}")
  cid=$(echo "$res" | (jq -r '.[0].cid' || jq -r '.cid' ) 2>/dev/null || true)
  echo "$f -> $cid"
done

echo "Pinning complete. NOTE: keep WEB3_STORAGE_TOKEN in CI secrets, do not commit it."
