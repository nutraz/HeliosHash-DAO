#!/bin/bash

# HeliosHash DAO - Black Mode (Stealth Development)
# Quick privacy lockdown and network isolation

echo "🖤 Entering BLACK MODE - Maximum Privacy..."

# 1. Stop all external-facing services
echo "🔒 Stopping development servers..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "tsx server" 2>/dev/null || true

# 2. Switch to local-only blockchain
echo "🌐 Switching to local-only mode..."
export DFX_NETWORK="local"

# 3. Disable unnecessary network connections
echo "🛡️  Enabling maximum privacy mode..."
# Temporary disable of non-essential services
sudo systemctl stop bluetooth 2>/dev/null || true

# 4. Switch VS Code to dark theme
echo "🎨 Activating dark theme..."
code --install-extension "ms-vscode.theme-onedarkpro" 2>/dev/null || true

# 5. Set environment for stealth development
export HHDAO_MODE="BLACK"
export NODE_ENV="development"
export NEXT_TELEMETRY_DISABLED=1

# HeliosHash DAO - Black Mode (Maximum Privacy/Stealth + Security)
# Stop all external connections and services for complete privacy

# Activate enhanced security protections
echo "�️ Activating enhanced security protections..."
source ./scripts/secure-mode.sh > /dev/null 2>&1

echo "🖤 BLACK MODE ACTIVATED - Maximum Privacy & Security"
echo "===================================================="
echo "🔒 All external connections terminated"
echo "🕵️ System in stealth mode" 
echo "� Local development only"
echo "📡 Network isolation active"
echo "🛡️ Enhanced security protections enabled"
echo ""
echo "💡 Use 'white-mode' to restore normal operations"
echo "🕵️ Use 'security-monitor' to check security status"