#!/bin/bash

# Mobile Development Setup for HHDAO
# This script sets up the environment for mobile access

echo "🚀 HeliosHash DAO Mobile Setup"
echo "================================"

# Get local IP
LOCAL_IP=$(ip route get 1 | awk '{print $7}' | head -1)
echo "📱 Local IP Address: $LOCAL_IP"

# Check if ports are accessible
echo "🔍 Checking port accessibility..."

# Check port 3001 (Frontend)
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Frontend server running on port 3001"
else
    echo "❌ Frontend server not running on port 3001"
fi

# Check port 8000 (IC Replica)
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ IC Replica running on port 8000"
else
    echo "❌ IC Replica not running on port 8000"
fi

# Setup firewall rules for mobile access
echo "🔥 Setting up firewall rules..."
sudo firewall-cmd --zone=public --add-port=3001/tcp --permanent 2>/dev/null || echo "Port 3001 already open"
sudo firewall-cmd --zone=public --add-port=8000/tcp --permanent 2>/dev/null || echo "Port 8000 already open"
sudo firewall-cmd --reload 2>/dev/null || echo "Firewall reload not needed"

echo "📱 Mobile Access URLs:"
echo "   Frontend:   http://$LOCAL_IP:3001"
echo "   Login:      http://$LOCAL_IP:3001/auth/login" 
echo "   IC Replica: http://$LOCAL_IP:8000"

echo ""
echo "🎯 Next Steps:"
echo "1. Connect your phone to the same WiFi network"
echo "2. Open browser on phone and go to: http://$LOCAL_IP:3001/auth/login"
echo "3. Try Social Login (Google, GitHub, etc.) for best mobile experience"
echo "4. Test the duo validation system!"

echo ""
echo "🔧 Troubleshooting:"
echo "- If connection fails, check WiFi network is the same"
echo "- Ensure firewall allows connections on ports 3001 and 8000"
echo "- Try restarting the development server: pnpm dev"