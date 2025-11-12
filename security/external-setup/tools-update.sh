#!/usr/bin/env bash
set -euo pipefail

echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y

# npm
if command -v npm &>/dev/null; then
  echo "Updating npm & global packages..."
  sudo npm install -g npm@latest
  npm update -g
fi

# pip
if command -v pip &>/dev/null; then
  echo "Updating pip & Python packages..."
  pip install --upgrade pip
  pip list --outdated --format=freeze | cut -d = -f1 | xargs -n1 pip install -U
fi

# composer
if command -v composer &>/dev/null; then
  echo "Updating Composer..."
  composer self-update
  composer global update
fi

echo "All dev tools updated."
echo "Schedule weekly: 0 3 * * 0 $(pwd)/tools-update.sh"
