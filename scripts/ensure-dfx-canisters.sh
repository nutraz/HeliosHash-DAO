#!/usr/bin/env bash
# Ensure dfx is running and required canisters exist; then call status/version commands.
# Usage: ./scripts/ensure-dfx-canisters.sh
# Optionally deploy code by uncommenting the deploy section.

set -euo pipefail

# Config
REQUIRED_CANISTERS=(
  identity_canister
  verifier_service
  audit_log_canister
  revocation_canister
  treasury
  governance
)

DFX_START_TIMEOUT=90
DFX_POLL_INTERVAL=2

# Helpers
timestamp() { date +"%Y-%m-%d %H:%M:%S"; }

echo "$(timestamp) | ensure-dfx-canisters.sh starting..."

# Ensure scripts directory exists in case this is run from other paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd || echo "$PWD")"
cd "$REPO_ROOT"

echo "$(timestamp) | Repo root: $REPO_ROOT"

# 1) Start dfx if it isn't running
echo "$(timestamp) | Checking for running dfx process..."
if pgrep -af '\bdfx\b' >/dev/null 2>&1; then
  echo "$(timestamp) | dfx appears to be already running. Skipping 'dfx start'."
else
  echo "$(timestamp) | Starting dfx in background (clean)..."
  if ! command -v dfx >/dev/null 2>&1; then
    echo "$(timestamp) | ERROR: dfx not found in PATH. Install the DFINITY SDK and retry." >&2
    exit 10
  fi
  dfx start --background --clean
  echo "$(timestamp) | dfx start requested."
fi

# 2) Wait until dfx is responsive
echo "$(timestamp) | Waiting for dfx to become responsive..."
end_time=$((SECONDS + DFX_START_TIMEOUT))
while true; do
  if dfx canister list >/dev/null 2>&1; then
    echo "$(timestamp) | dfx is responsive."
    break
  fi
  if [ $SECONDS -ge $end_time ]; then
    echo "$(timestamp) | Timed out waiting for dfx to respond (waited ${DFX_START_TIMEOUT}s)." >&2
    exit 11
  fi
  sleep $DFX_POLL_INTERVAL
done

# 3) Ensure canister IDs exist (create if missing)
echo "$(timestamp) | Ensuring required canister IDs exist..."
for name in "${REQUIRED_CANISTERS[@]}"; do
  if dfx canister id "$name" >/dev/null 2>&1; then
    id=$(dfx canister id "$name" 2>/dev/null || echo "<unknown>")
    echo "$(timestamp) | - canister '$name' already exists: $id"
  else
    echo "$(timestamp) | - canister '$name' not found. Creating..."
    if dfx canister create "$name"; then
      id=$(dfx canister id "$name" 2>/dev/null || echo "<unknown>")
      echo "$(timestamp) |   created '$name' -> $id"
    else
      echo "$(timestamp) | ERROR: Failed to create canister '$name'." >&2
      exit 12
    fi
  fi
done

# 4) Optional: deploy code to canisters (uncomment to enable)
# NOTE: Only enable this if your dfx.json has the canister entries and code compiled.
# echo "$(timestamp) | Deploying canisters (optional) ..."
# dfx deploy --no-wallet

# 5) Call status/version commands for quick sanity checks
echo "$(timestamp) | Calling canister status/version commands (showing outputs):"
set +e

echo "-> treasury getVersion:"
dfx canister call treasury getVersion
echo "-> governance getVersion:"
dfx canister call governance getVersion

echo "-> identity_canister status:"
dfx canister call identity_canister status || echo "Failed to call identity_canister status"
echo "-> verifier_service status:"
dfx canister call verifier_service status || echo "Failed to call verifier_service status"
echo "-> audit_log_canister status:"
dfx canister call audit_log_canister status || echo "Failed to call audit_log_canister status"
echo "-> revocation_canister status:"
dfx canister call revocation_canister status || echo "Failed to call revocation_canister status"

set -e

echo "$(timestamp) | Done. All required canister IDs now exist (code deployment may still be required)."
exit 0
