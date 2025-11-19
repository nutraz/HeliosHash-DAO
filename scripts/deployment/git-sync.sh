#!/bin/bash

echo "🔄 HeliosHash DAO Git Sync"
echo "=========================="

# Navigate to project directory
cd ~/HeliosHash-DAO

# Stash any local changes
echo "💾 Stashing local changes..."
git stash push -m "Auto-stash before sync $(date)"

# Pull latest changes with merge strategy
echo "📥 Pulling latest changes..."
git pull origin main --no-rebase

# If there were stashed changes, try to apply them
if git stash list | grep -q "Auto-stash before sync"; then
    echo "🔄 Applying stashed changes..."
    git stash pop
    
    # If there are conflicts, notify user
    if git status | grep -q "both modified"; then
        echo "⚠️  Merge conflicts detected! Please resolve manually:"
        git status
    else
        echo "✅ Stashed changes applied successfully"
    fi
fi

# Show final status
echo "📊 Final repository status:"
git status --short

echo "✅ Git sync completed!"
