#!/bin/bash

# HeliosHash DAO Mobile Development Server
echo "🚀 Starting HeliosHash DAO for Mobile Development..."
echo ""

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')

# Check if development server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "📡 Starting development server..."
    npm run dev &
    
    # Wait for server to start
    echo "⏳ Waiting for server to initialize..."
    sleep 8
    
    # Check again
    while ! curl -s http://localhost:3000 > /dev/null; do
        echo "   Still starting..."
        sleep 3
    done
fi

echo "✅ Server is running!"
echo ""
echo "📱 HeliosHash DAO Mobile Access:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏠 Local Computer: http://localhost:3000"
echo "� Mobile Device:  http://$LOCAL_IP:3000"
echo "🏛️  Governance:    http://$LOCAL_IP:3000/community"
echo "🌐 QR Code Helper: http://$LOCAL_IP:3000/qr"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Tips:"
echo "   • Use /mobile route for React mobile app"
echo "   • Open mobile-demo.html for standalone demo"
echo "   • Press Ctrl+C to stop the server"
echo ""

# Open mobile app in default browser
if command -v xdg-open > /dev/null; then
    echo "🌐 Opening mobile app in browser..."
    xdg-open http://localhost:3000/mobile
elif command -v open > /dev/null; then
    echo "🌐 Opening mobile app in browser..."
    open http://localhost:3000/mobile
else
    echo "🌐 Please open http://localhost:3000/mobile in your browser"
fi

echo ""
echo "✨ HeliosHash DAO Mobile App is ready!"