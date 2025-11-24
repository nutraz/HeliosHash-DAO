#!/bin/bash

# Quick environment setup for development
set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔧 Setting up HHDAO Development Environment"

# Check if frontend canister exists and get ID
if dfx canister id frontend > /dev/null 2>&1; then
    CANISTER_ID=$(dfx canister id frontend)
    echo "✅ Found frontend canister: $CANISTER_ID"
    
    # Update web app environment
    WEB_ENV="$PROJECT_ROOT/apps/web/.env.local"
    echo "NEXT_PUBLIC_FRONTEND_CANISTER_ID=$CANISTER_ID" > "$WEB_ENV"
    echo "NEXT_PUBLIC_IC_HOST=https://$CANISTER_ID.ic0.app" >> "$WEB_ENV"
    echo "✅ Updated $WEB_ENV"
    
    # Update root environment
    ROOT_ENV="$PROJECT_ROOT/.env"
    if [ ! -f "$ROOT_ENV" ]; then
        touch "$ROOT_ENV"
    fi
    if grep -q "FRONTEND_CANISTER_ID" "$ROOT_ENV"; then
        sed -i.bak "s/FRONTEND_CANISTER_ID=.*/FRONTEND_CANISTER_ID=$CANISTER_ID/" "$ROOT_ENV"
        rm -f "$ROOT_ENV.bak"
    else
        echo "FRONTEND_CANISTER_ID=$CANISTER_ID" >> "$ROOT_ENV"
    fi
    echo "✅ Updated $ROOT_ENV"
    
    echo ""
    echo "🎯 Development environment ready!"
    echo "🌐 Local URL: http://$CANISTER_ID.localhost:8000"
    echo "🌐 Production URL: https://$CANISTER_ID.ic0.app"
else
    echo "❌ Frontend canister not deployed yet"
    echo "💡 Run: pnpm run deploy:web-canister"
    exit 1
fi
