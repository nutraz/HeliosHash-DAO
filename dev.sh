#!/bin/bash
echo "🔄 Starting HHDAO full-stack dev environment..."

# Check if dfx is available
if command -v dfx &> /dev/null; then
    # Terminal 1: DFX emulator
    echo "🔁 Starting DFX..."
    dfx start --clean --background

    # Terminal 2: Deploy canisters
    echo "🔁 Deploying canisters..."
    dfx deploy
else
    echo "⚠️  DFX not found. Install DFX from https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    echo "🔁 Skipping canister deployment, starting frontend only..."
fi

# Terminal 3: Frontend dev server
echo "🔁 Starting Vite dev server..."
pnpm dev
