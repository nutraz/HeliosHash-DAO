#!/usr/bin/env bash
set -euo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$DIR/.."
CANISTERS_DIR="$ROOT/canisters"

TEMPLATE='[package]
name = "__NAME__"
version = "0.1.0"

[dependencies]
base = "0.16.0"

[package.metadata]
# Auto-generated minimal mops.toml to satisfy dfx/mops build requirements.
# Replace with real dependencies if needed.
'

echo "Patching small mops.toml files (size < 100 bytes)"
patched=()
for can in "$CANISTERS_DIR"/*; do
  [ -d "$can" ] || continue
  name=$(basename "$can")
  mf="$can/mops.toml"
  if [ -f "$mf" ]; then
    size=$(stat -c%s "$mf" || stat -f%z "$mf") || size=0
    if [ "$size" -lt 100 ]; then
      echo "Backing up and patching $mf (size=${size})"
      cp "$mf" "$mf.bak"
      echo "${TEMPLATE//__NAME__/$name}" > "$mf"
      patched+=("$name")
    fi
  else
    echo "No mops.toml in $name — creating minimal one"
    echo "${TEMPLATE//__NAME__/$name}" > "$mf"
    patched+=("$name")
  fi
done

if [ ${#patched[@]} -eq 0 ]; then
  echo "No files patched"
else
  echo "Patched mops.toml in: ${patched[*]}"
  echo "Running 'mops install' in patched canisters"
  for name in "${patched[@]}"; do
    echo "Installing in $name"
    cd "$CANISTERS_DIR/$name"
    mops install || echo "mops install failed for $name"
  done
fi

echo "Done." 
