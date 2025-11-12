#!/usr/bin/env bash
# ==============================================
# 🚀 HeliosHash DAO Unified Dev Stack Launcher
# ==============================================

echo "=============================================="
echo "  HeliosHash DAO Unified Dev Stack Launcher"
echo "=============================================="
echo
echo "Choose what to start:"
echo "1️⃣  Backend (Canisters + DFX)"
echo "2️⃣  Frontend (Next.js)"
echo "3️⃣  Both (Full Stack)"
echo
read -p "Enter choice [1/2/3]: " choice

# --- Auto Port Selection for DFX ---
DFX_PORT=4943
if sudo lsof -i :$DFX_PORT >/dev/null 2>&1; then
  echo "⚠️ Port $DFX_PORT busy — switching to 4944."
  DFX_PORT=4944
fi

start_backend() {
  echo
  echo "🧱 Cleaning and starting DFX on port $DFX_PORT..."
  pkill dfx >/dev/null 2>&1
  sleep 1
  dfx start --background --host 127.0.0.1:$DFX_PORT --clean
  sleep 3
  echo "✅ DFX running on 127.0.0.1:$DFX_PORT"

  echo
  echo "🛠️  Deploying local canisters..."
  cd ~/HeliosHash-DAO/backend || exit
  dfx deploy
  echo "✅ Backend (canisters) ready."
}

start_frontend() {
  echo
  echo "🌐 Starting Frontend (Next.js)..."
  cd ~/HeliosHash-DAO/apps/web || exit
  pnpm install
  pnpm run dev &
  echo "✅ Frontend running — check http://localhost:3002"
}

open_vscode() {
  echo
  echo "🧭 Opening VS Code windows..."
  code -n ~/HeliosHash-DAO/backend &
  code -n ~/HeliosHash-DAO/apps/web &
}

case $choice in
  1)
    start_backend
    open_vscode
    ;;
  2)
    start_frontend
    open_vscode
    ;;
  3)
    start_backend
    start_frontend
    open_vscode
    ;;
  *)
    echo "❌ Invalid choice. Exiting."
    exit 1
    ;;
esac

echo
echo "=============================================="
echo "✅ HeliosHash DAO Dev Stack Started Successfully"
echo "=============================================="

