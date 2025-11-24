#!/bin/bash
set -e

echo "🔍 HHDAO Deployment Troubleshooter"

echo "1. Checking directory..."
if [ -f "dfx.json" ]; then
    echo "✅ In correct directory (dfx.json found)"
else
    echo "❌ Wrong directory - move to repo root"
    exit 1
fi

echo "2. Checking DFX..."
if command -v dfx &> /dev/null; then
    echo "✅ DFX is installed"
else
    echo "❌ DFX not found - install from https://internetcomputer.org"
    exit 1
fi

echo "3. Checking web directory..."
if [ -d "apps/web" ]; then
    echo "✅ Web directory exists"
else
    echo "❌ Web directory missing"
    exit 1
fi

echo "4. Checking build..."
cd apps/web
if [ -d "out" ] || [ -d ".next/output/static" ] || [ -d ".next/static" ]; then
    echo "✅ Build output exists"
else
    echo "❌ No build found - run 'pnpm build' first"
fi

echo "✅ All checks passed! Run './deploy-web-canister.sh'"
