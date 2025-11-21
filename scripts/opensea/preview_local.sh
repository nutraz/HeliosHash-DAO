#!/usr/bin/env bash
set -euo pipefail

# Serve the build/opensea directory locally for preview via a simple static server
OUTDIR=${1:-build/opensea}
PORT=${2:-8080}

if [ ! -d "$OUTDIR" ]; then
  echo "$OUTDIR does not exist. Run render first: node scripts/opensea/render_metadata.js"
  exit 1
fi

echo "Serving $OUTDIR on http://localhost:$PORT"
python3 -m http.server "$PORT" --directory "$OUTDIR"
