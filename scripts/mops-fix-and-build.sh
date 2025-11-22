#!/usr/bin/env bash
set -euo pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$DIR/.."
CANISTERS_DIR="$ROOT/canisters"

echo "Starting mops init/install across canisters in $CANISTERS_DIR"
FAILED_INIT=()
FAILED_INSTALL=()
MISSING_MAIN=()

for can in "$CANISTERS_DIR"/*; do
  [ -d "$can" ] || continue
  name=$(basename "$can")
  echo "\n--- Processing canister: $name ---"
  cd "$can"

  # Try preferred non-interactive init, fallback if unsupported
  if [ ! -f "mops.toml" ]; then
    echo "Initializing mops in $name"
    if mops init --type project --yes >/dev/null 2>&1; then
      echo "mops init succeeded with flags"
    else
      echo "mops init with flags not supported; falling back to interactive suppression"
      if yes | mops init >/dev/null 2>&1; then
        echo "mops init (fallback) succeeded"
      else
        echo "mops init failed for $name"
        FAILED_INIT+=("$name")
        # Continue to attempt install in case file already present
      fi
    fi
  else
    echo "mops.toml already present in $name"
  fi

  echo "Installing mops dependencies for $name"
  if mops install >/dev/null 2>&1; then
    echo "mops install OK for $name"
  else
    echo "mops install FAILED for $name"
    FAILED_INSTALL+=("$name")
  fi

  # Verify mops.toml size
  if [ -f "mops.toml" ]; then
    size=$(stat -c%s "mops.toml" || stat -f%z "mops.toml")
    echo "mops.toml size for $name: ${size} bytes"
    if [ "$size" -lt 100 ]; then
      echo "Warning: mops.toml for $name is very small (<100B). It may be invalid."
    fi
  else
    echo "mops.toml missing for $name after init"
  fi

  # Verify main.mo presence
  if [ -f "main.mo" ] || [ -f "src/main.mo" ] || [ -f "src/helioshash_backend_backend/main.mo" ]; then
    echo "Found main.mo for $name"
  else
    echo "main.mo not found for $name"
    MISSING_MAIN+=("$name")
  fi

  cd - > /dev/null
done

# Summary
echo "\n=== Initialization Summary ==="
if [ ${#FAILED_INIT[@]} -ne 0 ]; then
  echo "Failed mops init for: ${FAILED_INIT[*]}"
else
  echo "mops init succeeded for all processed canisters"
fi
if [ ${#FAILED_INSTALL[@]} -ne 0 ]; then
  echo "Failed mops install for: ${FAILED_INSTALL[*]}"
else
  echo "mops install succeeded for all processed canisters"
fi
if [ ${#MISSING_MAIN[@]} -ne 0 ]; then
  echo "Canisters missing main.mo: ${MISSING_MAIN[*]}"
else
  echo "All canisters have main.mo (or src/main.mo)"
fi

# Proceed to clean dfx and rebuild only if no critical init failures
if [ ${#FAILED_INIT[@]} -ne 0 ] || [ ${#FAILED_INSTALL[@]} -ne 0 ] || [ ${#MISSING_MAIN[@]} -ne 0 ]; then
  echo "\nOne or more canisters have issues. Fix those before building. Exiting with code 2."
  exit 2
fi

# Clean dfx cache
echo "\nStopping dfx (if running) and removing .dfx"
dfx stop || true
rm -rf "$ROOT/.dfx"

# Start dfx and deploy
echo "Starting dfx (clean) and deploying canisters"
cd "$ROOT"
dfx start --clean &
# give replica time to start
sleep 6
if dfx deploy; then
  echo "dfx deploy succeeded"
else
  echo "dfx deploy failed" >&2
  exit 3
fi

echo "\nAll done."
