#!/bin/bash

echo "🚀 Starting HeliosHash-DAO FULL STACK Development Environment..."

# Start IC replica
echo "⚙️  Starting Internet Computer replica..."
dfx start --clean --background 2>/dev/null || echo "⚠️  DFX not available or already running"

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d 2>/dev/null || echo "⚠️  Docker not available"

# Wait for services
echo "⏳ Waiting for services to initialize..."
sleep 3

# Start Supabase
echo "🗄️  Starting Supabase..."
supabase start 2>/dev/null || echo "⚠️  Supabase not available"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing Node.js dependencies..."
  pnpm install
fi

if [ ! -d ".dart_tool" ]; then
  echo "📱 Installing Flutter dependencies..."
  flutter pub get
fi

echo "
╔════════════════════════════════════════════════════════╗
║       HeliosHash-DAO Full Stack Started!               ║
╚════════════════════════════════════════════════════════╝

📱 Flutter Mobile:  Run 'flutter run -d chrome'
🌐 Next.js Web:     Run 'pnpm dev' → http://localhost:3001
⚙️  IC Backend:      Replica running in background
🐳 Docker:          Services running (if available)
🗄️  Supabase:       Local instance running (if available)

Type 'hhdao-help' for more commands
"

# Start Next.js dev server
echo "🌐 Starting Next.js development server..."
pnpm dev
