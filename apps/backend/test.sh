#!/bin/bash
set -euo pipefail

echo "Starting local dfx replica (background, clean)..."
dfx stop 2>/dev/null || true
dfx start --background --clean

echo "Building canisters..."
cd "$(dirname "$0")/.." || exit 1
dfx build

echo "Deploying canisters (local)..."
dfx deploy --no-wallet || true

echo "Creating a bootstrap proposal for smoke test..."
dfx canister call governance createProposal '(record { title = "Bootstrap"; description = "Initial bootstrap" })' || true

echo "To inspect proposals run:"
echo "  dfx canister call governance getProposals"
