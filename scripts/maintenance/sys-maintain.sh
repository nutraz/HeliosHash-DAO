#!/bin/bash

echo "🔧 HeliosHash DAO System Maintenance"
echo "===================================="

# Function to display usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  --clean-cache     Clean project caches"
    echo "  --update-deps     Update dependencies"
    echo "  --disk-space      Check disk space"
    echo "  --all             Run all maintenance tasks"
    echo "  --help            Show this help message"
}

# Default values
CLEAN_CACHE=false
UPDATE_DEPS=false
DISK_SPACE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --clean-cache)
            CLEAN_CACHE=true
            shift
            ;;
        --update-deps)
            UPDATE_DEPS=true
            shift
            ;;
        --disk-space)
            DISK_SPACE=true
            shift
            ;;
        --all)
            CLEAN_CACHE=true
            UPDATE_DEPS=true
            DISK_SPACE=true
            shift
            ;;
        --help)
            usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# If no options provided, show usage
if [ "$CLEAN_CACHE" = false ] && [ "$UPDATE_DEPS" = false ] && [ "$DISK_SPACE" = false ]; then
    usage
    exit 0
fi

# Clean caches
if [ "$CLEAN_CACHE" = true ]; then
    echo "🧹 Cleaning project caches..."
    # Clean Node.js caches
    find . -name "node_modules" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
    # Clean build directories
    find . -name "build" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
    find . -name ".next" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
    find . -name "dist" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
    echo "✅ Cache cleaning completed"
fi

# Update dependencies
if [ "$UPDATE_DEPS" = true ]; then
    echo "🔄 Updating dependencies..."
    
    # Update pnpm packages if package.json exists
    if [ -f "package.json" ]; then
        echo "📦 Updating Node.js dependencies..."
        pnpm update || npm update || yarn upgrade
    fi
    
    # Update Flutter dependencies if pubspec.yaml exists
    if [ -f "pubspec.yaml" ]; then
        echo "📱 Updating Flutter dependencies..."
        flutter pub upgrade
    fi
    
    echo "✅ Dependency updates completed"
fi

# Check disk space
if [ "$DISK_SPACE" = true ]; then
    echo "💾 Disk space usage:"
    df -h /home/nutarzz
    echo ""
    echo "📁 Project directory size:"
    du -sh .
    echo ""
    echo "📊 Large directories:"
    find . -type d -name "node_modules" -o -name ".git" -o -name "build" | head -10
fi

echo "✅ System maintenance completed!"
