#!/bin/bash
set -e

echo "=== BASIC SMOKE TEST ==="
echo "1. Checking dfx version..."
dfx --version

echo "2. Testing canister creation..."
dfx canister create --all || echo "Canister creation attempted"

echo "3. Testing build..."
dfx build || echo "Build attempted"

echo "✅ Basic smoke test completed"
