#!/bin/bash
# dfx repair script - ensures dfx binary is accessible at expected cache path
# This fixes VS Code extension issues when dfx binary is missing from version-specific cache

set -e

DFX_VERSION="${1:-0.29.1}"
CACHE_PATH="$HOME/.cache/dfinity/versions/$DFX_VERSION/dfx"
ACTUAL_DFX="$HOME/.local/share/dfx/bin/dfx"

echo "🔧 DFX Repair Script"
echo "Checking dfx installation for version: $DFX_VERSION"

# Check if actual dfx binary exists
if [ ! -f "$ACTUAL_DFX" ]; then
    echo "❌ Error: dfx binary not found at $ACTUAL_DFX"
    echo "Install dfx first: sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
    exit 1
fi

# Check version match
ACTUAL_VERSION=$("$ACTUAL_DFX" --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')
if [ "$ACTUAL_VERSION" != "$DFX_VERSION" ]; then
    echo "⚠️  Version mismatch: found $ACTUAL_VERSION, expected $DFX_VERSION"
    echo "Consider updating DFX_VERSION parameter or upgrading dfx"
fi

# Create cache directory if missing
CACHE_DIR=$(dirname "$CACHE_PATH")
if [ ! -d "$CACHE_DIR" ]; then
    echo "📁 Creating cache directory: $CACHE_DIR"
    mkdir -p "$CACHE_DIR"
fi

# Create or fix symlink
if [ -L "$CACHE_PATH" ] && [ "$(readlink "$CACHE_PATH")" = "$ACTUAL_DFX" ]; then
    echo "✅ Symlink already exists and points correctly"
elif [ -f "$CACHE_PATH" ]; then
    echo "🔗 Replacing existing file with symlink"
    rm "$CACHE_PATH"
    ln -s "$ACTUAL_DFX" "$CACHE_PATH"
else
    echo "🔗 Creating symlink: $CACHE_PATH -> $ACTUAL_DFX"
    ln -s "$ACTUAL_DFX" "$CACHE_PATH"
fi

# Verify
if "$CACHE_PATH" --version &>/dev/null; then
    echo "✅ dfx repair complete - VS Code extension should now work"
else
    echo "❌ Symlink created but dfx not executable - check permissions"
    exit 1
fi