#!/bin/bash

# HeliosHash DAO Mobile App Quick Launch
echo "🚀 Starting HeliosHash DAO Mobile App..."
echo ""

# Check if development server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "📡 Starting development server..."
    pnpm dev &
    
    # Wait for server to start
    echo "⏳ Waiting for server to initialize..."
    sleep 5
    
    # Check again
    while ! curl -s http://localhost:3000 > /dev/null; do
        echo "   Still starting..."
        sleep 2
    done
fi

echo "✅ Server is running!"
echo ""
echo "🌞 HeliosHash DAO Mobile App URLs:"
echo "   🖥️  Desktop:  http://localhost:3000"
echo "   📱 Mobile:   http://localhost:3000/mobile"
echo "   📄 Demo:     file://$(pwd)/mobile-demo.html"
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