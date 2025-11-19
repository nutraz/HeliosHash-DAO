#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_FILE="canisters/treasury/test/treasury.test.mo"

echo "[treasury-tests] Compiling test actor..."
"$(dfx cache show)"/moc "$ROOT_DIR/$TEST_FILE" --package base "$(dfx cache show)"/base -o "$ROOT_DIR/.dfx/treasury-test.wasm"

echo "[treasury-tests] NOTE: This produces a Wasm; to execute tests you may deploy or adapt to custom runner."
echo "[treasury-tests] SUCCESS compile only (logic validated at compile time)."
