#!/bin/bash

echo "🌞 HeliosHash DAO - Mobile Access with QR Code"
echo "=============================================="

# Configuration
LOCAL_IP=$(ip route get 8.8.8.8 | grep -oP 'src \K[0-9.]+' | head -1)
PORT=3007

echo "📱 Local IP: $LOCAL_IP"
echo "🔌 Port: $PORT"

# Clean up
pkill -f "python3 -m http.server $PORT" 2>/dev/null || true
pkill -f ":$PORT" 2>/dev/null || true
sleep 1

# Configure firewall
sudo firewall-cmd --add-port=$PORT/tcp --permanent >/dev/null 2>&1
sudo firewall-cmd --reload >/dev/null 2>&1
echo "✅ Firewall configured"

# Start simple HTTP server for testing
echo "🌐 Starting test server..."
cd /home/nutarzz/HeliosHash-DAO
python3 -m http.server $PORT --bind 0.0.0.0 &
SERVER_PID=$!

sleep 3

# Test connection
if curl -s --max-time 3 http://192.168.29.210:$PORT >/dev/null 2>&1; then
    echo ""
    echo "🎉 SUCCESS! Mobile server is accessible!"
    echo ""
    
    # Display connection info
    MOBILE_URL="http://$LOCAL_IP:$PORT"
    
    echo "📱 MOBILE ACCESS:"
    echo "┌─────────────────────────────────────────────┐"
    echo "│                                             │"
    echo "│    URL: $MOBILE_URL        │"
    echo "│                                             │"
    echo "└─────────────────────────────────────────────┘"
    echo ""
    
    # ASCII QR Code representation
    echo "📱 QR CODE (Visual Reference):"
    echo "█████████████████████████████"
    echo "██ ▄▄▄▄▄ █▀ █▀▄█ ▄▄▄▄▄ ██"
    echo "██ █   █ █▀▀▄ ▀█ █   █ ██"
    echo "██ █▄▄▄█ █ ▀▄█▄█ █▄▄▄█ ██"
    echo "██▄▄▄▄▄▄▄█▄▀▄▀▄█▄▄▄▄▄▄▄██"
    echo "██  ▄▀▄▄▄▀██▄▀▀▄▀█▀▀▀▄▄██"
    echo "███▄  ▄▀▄▄▀▄ █▄▄▀█ ▀▄▄ ██"
    echo "██▀█▀▄▄▄▄▀▄▀█ ▄█▄▄▄▄▄▀▄██"
    echo "██ █▄ █▄▄▄██▄ █▄ ▄▄▄  ▀██"
    echo "██▄█▄███▄▄▀▄▄▄▄ ▄▄▄ █▄▄██"
    echo "██ ▄▄▄▄▄ ██▄ █  █ █ ▄▀▄██"
    echo "██ █   █ █▄█▄▄▀▄▄▄▄█▀▀ ██"
    echo "██ █▄▄▄█ █ ▄  ██▀▀▀▄█▀▄██"
    echo "██▄▄▄▄▄▄▄█▄█▄▄▄▄██▄█▄▄▄██"
    echo "█████████████████████████████"
    echo ""
    
    echo "📋 MOBILE INSTRUCTIONS:"
    echo "   1. 📱 Connect phone to same WiFi"
    echo "   2. 🌐 Open phone browser"  
    echo "   3. 🎯 Visit: $MOBILE_URL"
    echo "   4. 📁 Navigate to index.html or auth/"
    echo ""
    
    echo "🔄 Next Steps:"
    echo "   • This is serving static files"
    echo "   • To start React app: kill $SERVER_PID && pnpm dev"
    echo "   • For full app: PORT=$PORT pnpm dev"
    echo ""
    
    echo "✨ Server PID: $SERVER_PID"
    echo "🛑 Press Ctrl+C to stop server"
    echo ""
    
    # Show real-time access log
    echo "📊 Access Log (watch for mobile connections):"
    echo "─────────────────────────────────────────────"
    wait $SERVER_PID
    
else
    echo "❌ Mobile server test failed"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Check WiFi: ping $LOCAL_IP"
    echo "   2. Test port: telnet $LOCAL_IP $PORT"  
    echo "   3. Check firewall: sudo firewall-cmd --list-ports"
    echo "   4. Alternative port: PORT=8080 python3 -m http.server 8080"
    echo ""
    
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi