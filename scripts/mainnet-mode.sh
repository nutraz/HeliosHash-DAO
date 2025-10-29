#!/bin/bash

# HeliosHash DAO - Mainnet Mode (Connect to One World Project)
# Connect to the real UrgamU Smart City DAO

echo "🌍 Connecting to One World Project Network..."
echo "🏙️  Target: UrgamU Smart City DAO"

# 1. Set mainnet configuration
export DFX_NETWORK="ic"
export HHDAO_MODE="MAINNET"
export NEXT_PUBLIC_IC_HOST="https://ic0.app"

# 2. Configure for One World Project integration
export OWP_DAO_ID="UrgamUSmartCity"
export OWP_API_URL="https://dapp.oneworldproject.io"
export OWP_NODE_TYPE="India"

# 3. Set production environment
export NODE_ENV="production"
export NEXT_PUBLIC_NETWORK="mainnet"

# 4. Display connection information
echo ""
echo "🌍 ONE WORLD PROJECT - MAINNET MODE"
echo "=================================="
echo "🏙️  Target DAO: UrgamU Smart City"
echo "🔗 Network: Internet Computer Mainnet"
echo "🇮🇳 Node Type: India"
echo "📍 URL: https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity"
echo ""
echo "⚠️  WARNING: This will connect to REAL blockchain!"
echo "💰 Real ICP tokens and cycles will be used"
echo ""

read -p "🤔 Continue to mainnet? (y/N): " confirm
if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo ""
    echo "🚀 Deploying to Internet Computer mainnet..."
    
    # Deploy to mainnet (requires real ICP)
    dfx deploy --network ic --with-cycles 1000000000000
    
    echo ""
    echo "✅ CONNECTED TO ONE WORLD PROJECT MAINNET!"
    echo "🏙️  UrgamU Smart City DAO integration active"
    echo "🌍 You are now part of the global 1WP network"
    
else
    echo "❌ Mainnet connection cancelled"
    echo "🔄 Staying in development mode"
fi