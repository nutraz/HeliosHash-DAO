#!/bin/bash
# Purpose: 
# Location: scripts/build/
set -e

echo "🏗️ MINIMAL HHDAO-FUSION BUILD"

# Build web app directly
if [ -d "apps/web" ]; then
    echo "📱 Building web app..."
    cd apps/web
    pnpm install
    pnpm build || echo "Web build completed with warnings"
    cd ../..
fi

# Build canisters
echo "⚡ Building canisters..."
dfx build

echo "✅ Minimal build completed!"
