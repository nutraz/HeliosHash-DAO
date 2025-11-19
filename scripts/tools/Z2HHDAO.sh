#!/bin/bash
cd ~/HeliosHash-DAO

echo "Select module to run:"
echo "1) Frontend"
echo "2) Backend"
echo "3) Both"
read -p "Enter choice: " choice

case $choice in
  1)
    echo "🚀 Starting Frontend..."
    cd apps/web
    pnpm install
    pnpm run dev
    ;;
  2)
    echo "🚀 Starting Backend..."
    cd backend
    dfx start --background --clean
    ;;
  3)
    echo "🚀 Starting Full Stack..."
    cd backend
    dfx start --background --clean
    sleep 5
    cd ../apps/web
    pnpm install
    pnpm run dev
    ;;
  *)
    echo "❌ Invalid choice."
    ;;
esac

