#!/bin/bash

echo "=== Updating Development Tools ==="
echo "Started at: $(date)"

# System packages
echo "Updating system packages..."
if command -v dnf &> /dev/null; then
    sudo dnf update -y
    sudo dnf autoremove -y
elif command -v apt &> /dev/null; then
    sudo apt update
    sudo apt upgrade -y
    sudo apt autoremove -y
fi

# Node.js/npm (if installed)
if command -v npm &> /dev/null; then
    echo "Updating npm and global packages..."
    npm install -g npm@latest
    npm update -g
fi

# Python/pip (if installed) - FIXED VERSION
if command -v pip3 &> /dev/null; then
    echo "Updating pip and Python packages..."
    pip3 install --upgrade pip
    # Correct way to update outdated packages
    pip3 list --outdated --format=json | python3 -c "
import json, sys
packages = json.load(sys.stdin)
for pkg in packages:
    print(pkg['name'])
" | xargs -r pip3 install -U
fi

# Rust (if installed)
if command -v rustup &> /dev/null; then
    echo "Updating Rust..."
    rustup update
fi

# VS Code extensions (if code command available)
if command -v code &> /dev/null; then
    echo "Updating VS Code extensions..."
    code --update-extensions
fi

echo "Update completed at: $(date)"
