#!/bin/bash

# HeliosHash DAO - White Mode (Return to Normal Development)
# Resume normal development mode

echo "🤍 Returning to WHITE MODE - Normal Development..."

# 1. Restore normal services
echo "🔄 Restoring development environment..."
sudo systemctl start bluetooth 2>/dev/null || true

# 2. Set development network
export DFX_NETWORK="local"
export HHDAO_MODE="DEVELOPMENT"
export NODE_ENV="development"

# 3. Restart development servers
echo "🚀 Starting development servers..."
cd /home/nutarzz/HeliosHash-DAO

# Start DFX local replica
dfx start --background --clean

# Start development server
nohup npx next dev > dev_server.log 2>&1 &
DEV_PID=$!

echo "🤍 WHITE MODE ACTIVE"
echo "   - Development servers restored"
echo "   - Local blockchain running"
echo "   - Normal privacy level"
echo "   - Frontend: http://localhost:3000"
echo "   - Dev server PID: $DEV_PID"
echo ""
echo "🖤 To go stealth: ./scripts/black-mode.sh"
echo "🌍 To go mainnet: ./scripts/mainnet-mode.sh"