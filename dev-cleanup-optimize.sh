#!/bin/bash
# =============================================
# Dev Environment Cleanup & Optimization Script
# Fedora / Linux – Safe for VS Code / HHDAO projects
# =============================================

set -euo pipefail

echo "🚀 Starting dev environment cleanup & optimization..."

# -------------------------
# 1️⃣ Update system packages
# -------------------------
echo "🛠 Updating system packages..."
sudo dnf update -y
sudo dnf upgrade -y

# -------------------------
# 2️⃣ Clean system caches (safe)
# -------------------------
echo "🧹 Cleaning system caches..."
rm -rf ~/.cache/* 2>/dev/null || true
rm -rf ~/.local/share/Trash/* 2>/dev/null || true

# -------------------------
# 3️⃣ Remove old HHDAO / conflicting scripts
# -------------------------
echo "🗑 Removing old scripts / conflicting HHDAO setups..."
rm -rf ~/backups ~/HHDAO-* ~/vscode-backup ~/scripts ~/hhdao-full-setup.sh 2>/dev/null || true
rm -rf ~/HHDAO-clean-* ~/HHDAO-SECURE-* ~/Z2HHDAO.sh 2>/dev/null || true

# -------------------------
# 4️⃣ VS Code / VSCodium optimization (safe)
# -------------------------
echo "⚡ Optimizing VS Code / VSCodium..."
VSCODE_CONFIG="$HOME/.config/Code"
if [ -d "$VSCODE_CONFIG" ]; then
    echo "🔹 Removing extension caches only..."
    rm -rf "$VSCODE_CONFIG/CachedExtensionVSIXs" "$VSCODE_CONFIG/Cache"
    echo "✅ VS Code caches cleaned (Backups preserved)"
fi

# Optional: reinstall extensions safely
if command -v code &> /dev/null; then
    echo "🔹 Listing installed extensions..."
    code --list-extensions > ~/vscode-extensions.txt
    echo "🔹 Reinstalling extensions (safe)..."
    xargs -L 1 code --install-extension < ~/vscode-extensions.txt
fi

# -------------------------
# 5️⃣ Node.js / npm update (safe)
# -------------------------
echo "🟢 Updating Node / npm..."
npm install -g npm
echo "🔹 Checking for stray Node.js processes..."
NODE_PIDS=$(pgrep -f "node" || true)
VS_CODE_RUNNING=$(pgrep -x code || true)

if [ -n "$NODE_PIDS" ] && [ -z "$VS_CODE_RUNNING" ]; then
    echo "⚡ Killing stray Node.js processes..."
    kill -9 $NODE_PIDS || true
    echo "✅ Node.js processes terminated."
else
    echo "✅ Node.js processes left intact (VS Code running)"
fi

# -------------------------
# 6️⃣ Python / pip update
# -------------------------
echo "🐍 Updating Python dependencies..."
pip install --upgrade pip setuptools wheel
if [ -f ~/HeliosHash-DAO/requirements.txt ]; then
    pip install -r ~/HeliosHash-DAO/requirements.txt
fi

# -------------------------
# 7️⃣ Rust update & cleanup
# -------------------------
echo "🦀 Updating Rust..."
rustup update
cargo clean

# -------------------------
# 8️⃣ Flutter / Dart update & safe cache cleanup
# -------------------------
echo "🟣 Updating Flutter / Dart..."
flutter upgrade
echo "🔹 Cleaning Flutter project caches..."
for dir in ~/HeliosHash-DAO/apps/mobile ~/HeliosHash-DAO/urgamu-project-dashboard; do
    if [ -d "$dir" ]; then
        cd "$dir"
        flutter clean
    fi
done

# -------------------------
# 9️⃣ Network & connectivity check
# -------------------------
echo "🌐 Checking network connectivity..."
ping -c 4 google.com || echo "⚠ Network issue detected!"

echo "🔹 GitHub connectivity check..."
git ls-remote https://github.com/nutraz/HeliosHash-DAO.git &> /dev/null
if [ $? -eq 0 ]; then
    echo "✅ GitHub reachable"
else
    echo "⚠ GitHub not reachable. Check VPN / firewall / proxy."
fi

echo "🔹 npm registry connectivity..."
npm ping &> /dev/null
if [ $? -eq 0 ]; then
    echo "✅ npm registry reachable"
else
    echo "⚠ npm registry not reachable"
fi

# -------------------------
# 10️⃣ Disk usage report
# -------------------------
echo "💾 Disk usage after cleanup:"
df -h

echo "🚀 Dev environment cleanup & optimization completed!"

