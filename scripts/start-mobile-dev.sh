#!/bin/bash

# Mobile Development Server Script
# This script ensures stable mobile connectivity for development

echo "🚀 Starting Mobile-Friendly Development Server"
echo "=============================================="

# Kill any existing servers
echo "🧹 Cleaning up existing processes..."
pkill -f "tsx server.ts" 2>/dev/null || true
pkill -f "python3 -m http.server" 2>/dev/null || true

# Get local IP
LOCAL_IP=$(ip route get 8.8.8.8 | grep -oP 'src \K[0-9.]+' | head -1)
echo "📱 Local IP: $LOCAL_IP"

# Check and configure firewall
echo "🔥 Configuring firewall..."
sudo firewall-cmd --add-port=3001/tcp --permanent >/dev/null 2>&1
sudo firewall-cmd --add-port=8000/tcp --permanent >/dev/null 2>&1
sudo firewall-cmd --reload >/dev/null 2>&1

echo "✅ Firewall configured for ports 3001 and 8000"

# Start the development server
echo "🌐 Starting development server..."
cd /home/nutarzz/HeliosHash-DAO

# Export environment variables
export NODE_ENV=development
export PORT=3001
export HOSTNAME=0.0.0.0

# Start server with better error handling
npx tsx server.ts &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Test server
if curl -s http://localhost:3001 >/dev/null 2>&1; then
    echo "✅ Server is running successfully!"
    echo ""
    echo "📱 Mobile Access URLs:"
    echo "   Main App:    http://$LOCAL_IP:3001"
    echo "   Login Page:  http://$LOCAL_IP:3001/auth/login"
    echo "   Dashboard:   http://$LOCAL_IP:3001/dashboard"
    echo ""
    echo "🔐 Authentication Options:"
    echo "   - Google OAuth (Recommended for mobile)"
    echo "   - GitHub OAuth"
    echo "   - Email/OTP"
    echo "   - Discord OAuth"
    echo "   - Twitter OAuth"
    echo ""
    echo "📋 Instructions:"
    echo "   1. Ensure your mobile device is on the same WiFi"
    echo "   2. Open browser on mobile"
    echo "   3. Navigate to: http://$LOCAL_IP:3001/auth/login"
    echo "   4. Use Social Login for easiest access"
    echo ""
    echo "🔄 Server running with PID: $SERVER_PID"
    echo "   To stop: kill $SERVER_PID"
    
    # Keep script running and show server output
    echo "📊 Server Output:"
    echo "=================="
    tail -f dev.log 2>/dev/null &
    wait $SERVER_PID
else
    echo "❌ Server failed to start"
    echo "📋 Troubleshooting:"
    echo "   - Check if port 3001 is already in use"
    echo "   - Verify Next.js dependencies are installed"
    echo "   - Check dev.log for error messages"
    exit 1
fi