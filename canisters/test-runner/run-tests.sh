#!/bin/bash
#!/bin/bash

# Find the moc compiler from DFX cache
MOC="$(dfx cache show)/moc"



# Set paths
CANISTERS=("hhdao" "auth")
SCRIPT_DIR="$(dirname "$0")"
# Repo root is two levels above canisters/test-runner
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TEST_DIR="$CANISTER_DIR/test"
SRC_DIR="$CANISTER_DIR/src"
WASM_DIR="wasm"

# Create wasm directory if it doesn't exist
mkdir -p $WASM_DIR


function build_canister_test() {
  local C=${1}
  local CANISTER_DIR="$ROOT_DIR/canisters/$C"
  local TEST_DIR="$CANISTER_DIR/test"
  local SRC_DIR="$CANISTER_DIR/src"
  local OUT="$WASM_DIR/$(basename $C)-test.wasm"

  echo "Compiling tests for $C..."
  $MOC -o $OUT \
    --package base "$(dfx cache show)/base" \
  $TEST_DIR/test-imports.mo \
  $SRC_DIR/test-utils.mo \
  $SRC_DIR/lib.mo \
  $TEST_DIR/test-runner-entry.mo
  if [ $? -ne 0 ]; then
    echo "Compilation failed for $C!"
    exit 1
  fi
}

if [ $? -ne 0 ]; then
  echo "Compilation failed!"
  exit 1
fi

echo "Running tests for all canisters..."
SCRIPT_DIR="$(dirname "$0")"
for cdir in "${CANISTERS[@]}"; do
  build_canister_test $cdir
  wasmfile="$WASM_DIR/$(basename $cdir)-test.wasm"
  echo "=== Running tests for $(basename $cdir) ==="
  node "$SCRIPT_DIR/test-runner.js" $wasmfile
done

# Check exit code
if [ $? -ne 0 ]; then
  echo "Tests failed!"
  exit 1
fi

# Clean up
rm -rf $WASM_DIR
