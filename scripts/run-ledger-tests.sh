#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_ACTOR="canisters/treasury/test/treasury.test.mo"

echo "[ledger-tests] Building test actor..."
"$(dfx cache show)"/moc "$ROOT/$TEST_ACTOR" --package base "$(dfx cache show)"/base -o "$ROOT/.dfx/ledger-test.wasm"

cat <<'EON'
[ledger-tests] NOTE:
  This produces a Wasm module containing the test actor.
  For full automation you can deploy it locally:
    dfx deploy --network local --no-wallet --mode reinstall --argument '( )' ledger_test_canister
  (Adjust dfx.json to add a canister entry if you want automated execution.)
EON

echo "[ledger-tests] Build complete."
