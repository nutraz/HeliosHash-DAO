#!/bin/bash
#!/bin/bash

# Find the moc compiler from DFX cache
MOC="$(dfx cache show)/moc"



# Set paths
CANISTER_DIR="canisters/hhdao"
TEST_DIR="$CANISTER_DIR/test"
SRC_DIR="$CANISTER_DIR/src"
WASM_DIR="wasm"

# Create wasm directory if it doesn't exist
mkdir -p $WASM_DIR


# Compile the test canister with all dependencies
echo "Compiling test canister..."
$MOC -o $WASM_DIR/hhdao-test.wasm \
  --package base "$(dfx cache show)/base" \
  $SRC_DIR/lib.mo \
  $TEST_DIR/test-utils.mo \
  $TEST_DIR/hhdao.test.mo

if [ $? -ne 0 ]; then
  echo "Compilation failed!"
  exit 1
fi

echo "Running tests..."
<<<<<<< HEAD
node test-runner.js $WASM_DIR/hhdao-test.wasm
=======
SCRIPT_DIR="$(dirname "$0")"
node "$SCRIPT_DIR/test-runner.js" $WASM_DIR/hhdao-test.wasm
>>>>>>> audit-clean

# Check exit code
if [ $? -ne 0 ]; then
  echo "Tests failed!"
  exit 1
fi

# Clean up
rm -rf $WASM_DIR
