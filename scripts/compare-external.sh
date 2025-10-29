#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 /absolute/path/to/external/workspace" >&2
  exit 1
fi

EXT_PATH="$1"
if [[ ! -d "$EXT_PATH" ]]; then
  echo "❌ Path not found: $EXT_PATH" >&2
  exit 1
fi

OUT_DIR="external-analysis"
mkdir -p "$OUT_DIR"

timestamp() { date -u +%Y-%m-%dT%H:%M:%SZ; }

echo "🧪 HeliosHash External Workspace Comparison"
echo "Path: $EXT_PATH"
echo "Time: $(timestamp)"

echo "📂 Capturing structures..."
tree -L 3 -I 'node_modules|.git|dist|build|.next' "$EXT_PATH" > "$OUT_DIR/external-structure.txt" || true
tree -L 3 -I 'node_modules|.git|dist|build|.next' > "$OUT_DIR/current-structure.txt" || true

echo "🔍 Diffing recursively (this can be large)..."
diff -ru \
  --exclude=node_modules --exclude=.git --exclude=dist --exclude=build \
  "$EXT_PATH" . > "$OUT_DIR/diff-report.txt" || true

echo "📊 Gathering metrics..."
echo "External TS lines:" > "$OUT_DIR/metrics.txt"
find "$EXT_PATH" -type f -name '*.ts' -o -name '*.tsx' | xargs wc -l 2>/dev/null | awk 'END{print}' >> "$OUT_DIR/metrics.txt" || true
echo "Current TS lines:" >> "$OUT_DIR/metrics.txt"
find src -type f -name '*.ts' -o -name '*.tsx' | xargs wc -l 2>/dev/null | awk 'END{print}' >> "$OUT_DIR/metrics.txt" || true

echo "File list delta:" >> "$OUT_DIR/metrics.txt"
comm -3 <(cd "$EXT_PATH" && find . -type f | sort) <(find . -type f | sort) >> "$OUT_DIR/metrics.txt" || true

echo "✅ Artifacts generated in ./$OUT_DIR" 
echo "   - external-structure.txt"
echo "   - current-structure.txt"
echo "   - diff-report.txt"
echo "   - metrics.txt"

echo "Tip: review diff-report.txt (can be large) or narrow scope manually."