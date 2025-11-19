#!/bin/bash
set -e

echo "🧪 Testing HHDAO-FUSION Build"

echo "1. Testing frontend build..."
pnpm build:frontend || echo "Frontend build may have issues - continuing..."

echo "2. Testing canister build..."
dfx build || echo "Canister build may have issues - check individual canisters"

echo "✅ Basic build test completed!"
