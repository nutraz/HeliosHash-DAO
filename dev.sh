#!/bin/bash
echo "🔄 Starting HHDAO full-stack dev environment..."

# Terminal 1: DFX emulator
echo "🔁 Starting DFX..."
dfx start --clean --background

# Terminal 2: Deploy canisters
echo "🔁 Deploying canisters..."
dfx deploy

# Terminal 3: Frontend dev server
echo "🔁 Starting Vite dev server..."
pnpm dev
