#!/bin/bash
set -e

echo "🚀 Syncing HeliosHash DAO..."

# Root dependencies
echo "📦 Installing root dependencies..."
pnpm install

# Backend
echo "🔧 Syncing backend..."
cd apps/backend
pnpm install
pnpm build
cd ../..

# Mobile app
echo "📱 Syncing mobile app..."
cd apps/mobile
flutter clean
flutter pub get
cd ../..

# Web app
if [ -d "apps/web" ]; then
    echo "🌐 Syncing web app..."
    cd apps/web
    pnpm install
    pnpm build
    cd ../..
fi

echo "✅ Sync complete!"
