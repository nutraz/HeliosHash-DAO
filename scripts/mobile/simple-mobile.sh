#!/bin/bash

echo "🚀 HeliosHash DAO - Simple Mobile Server"
echo "========================================"

# Get local IP and set port
LOCAL_IP=$(ip route get 8.8.8.8 | grep -oP 'src \K[0-9.]+' | head -1)
PORT=3007

echo "📱 Local IP: $LOCAL_IP"
echo "🔌 Port: $PORT"

# Clean up any existing processes
pkill -f ":$PORT" 2>/dev/null || true
pkill -f "tsx server.ts" 2>/dev/null || true
sleep 1

# Open firewall port
sudo firewall-cmd --add-port=$PORT/tcp --permanent >/dev/null 2>&1
sudo firewall-cmd --reload >/dev/null 2>&1
echo "✅ Firewall configured for port $PORT"

# Start server
echo "🌐 Starting development server..."
cd /home/nutarzz/HeliosHash-DAO

NODE_ENV=development PORT=$PORT HOSTNAME=0.0.0.0 npx tsx server.ts &
SERVER_PID=$!

# Wait and test
sleep 6
echo "🔍 Testing server..."

if curl -s --max-time 5 http://localhost:$PORT >/dev/null 2>&1; then
    echo ""
    echo "🎉 SUCCESS! Mobile server is ready!"
    echo ""
    echo "📱 ACCESS FROM YOUR PHONE:"
    echo "   URL: http://$LOCAL_IP:$PORT/auth/login"
    echo ""
    echo "🔐 Login with:"
    echo "   • Google (easiest on mobile)"
    echo "   • GitHub"
    echo "   • Email/OTP"
    echo ""
    
    # Display a simple text-based QR pattern for the URL
    URL="http://$LOCAL_IP:$PORT/auth/login"
    echo "📋 Copy this URL to your phone:"
    echo "┌────────────────────────────────────────┐"
    echo "│  $URL  │"
    echo "└────────────────────────────────────────┘"
    echo ""
    echo "🔄 Server PID: $SERVER_PID (kill $SERVER_PID to stop)"
    
    # Keep running
    echo "✨ Mobile server running! Press Ctrl+C to stop"
    wait $SERVER_PID
else
    echo "❌ Server failed to start on port $PORT"
    echo "💡 Try a different approach:"
    echo "   1. Check if dependencies are installed: pnpm install"
    echo "   2. Try port 3008: PORT=3008 npx tsx server.ts"
    echo "   3. Or use simple HTTP server: python3 -m http.server $PORT"
    
    kill $SERVER_PID 2>/dev/null || true
fi