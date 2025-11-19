#!/bin/bash
set -e

echo "🏗️ Building HHDAO-FUSION Unified"

# Build frontend apps only
echo "📱 Building frontend applications..."
pnpm build:frontend

# Build canisters with DFX  
echo "⚡ Building Motoko canisters..."
dfx build

echo "✅ HHDAO-FUSION build completed successfully!"
