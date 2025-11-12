#!/bin/bash
# hhdao-setup.sh
# Sync HeliosHash DAO repo, fix nested repos, update dev environment, and start project

set -e

HHDAO_DIR=~/HeliosHash-DAO

echo "🚀 Starting HHDAO sync & setup..."

# Step 1: Pull latest changes from Git
if [ -d "$HHDAO_DIR" ]; then
    echo "📂 Pulling latest changes in $HHDAO_DIR..."
    cd "$HHDAO_DIR"
    
    # Handle any nested git warnings
    NESTED_REPOS=$(find . -type d -name ".git" -path "./apps/*")
    if [ ! -z "$NESTED_REPOS" ]; then
        echo "⚠️  Found nested git repos. Flattening..."
        for repo in $NESTED_REPOS; do
            rm -rf "$repo"
        done
        git add .
        git commit -m "Flatten nested git repositories"
    fi

    git pull origin main
else
    echo "❌ HHDAO directory not found at $HHDAO_DIR"
    exit 1
fi

# Step 2: Add untracked builds / dashboards (optional)
echo "📦 Checking for untracked files..."
git add -u
git commit -m "Sync untracked builds and dashboards" || echo "No changes to commit."
git push origin main

# Step 3: Update system & dev environment
echo "🛠 Updating system packages..."
sudo dnf upgrade -y
flatpak update -y || echo "No flatpaks to update"

echo "🐍 Updating Python dependencies..."
pip install --upgrade pip setuptools wheel
if [ -f "$HHDAO_DIR/requirements.txt" ]; then
    pip install -r "$HHDAO_DIR/requirements.txt"
fi

echo "🟢 Updating Node / npm dependencies..."
npm install -g npm
cd "$HHDAO_DIR"
if [ -f package-lock.json ]; then
    npm ci
fi

echo "🦀 Updating Rust..."
rustup update

echo "🟣 Updating Flutter / Dart..."
flutter upgrade
flutter pub get

# Step 4: Android SDK / emulators (optional)
echo "🤖 Updating Android SDK..."
if [ -d "$HOME/Android/Sdk" ]; then
    yes | sdkmanager --update || echo "Android SDK not found or no updates available."
fi

# Step 5: Clean caches & temp files
echo "🧹 Cleaning caches and temp files..."
rm -rf ~/.cache/*
rm -rf ~/.local/share/Trash/*
flatpak uninstall --unused -y || true

# Step 6: Start HHDAO dev environment
echo "🚀 Starting HHDAO dev environment..."
if [ -f "$HHDAO_DIR/start-hhdao-dev.sh" ]; then
    bash "$HHDAO_DIR/start-hhdao-dev.sh"
else
    echo "❌ start-hhdao-dev.sh not found, please start manually"
fi

echo "✅ HHDAO sync & setup completed!"

