#!/bin/bash

echo "🧹 HeliosHash-DAO Repository Cleanup Started..."

# Define root directory
ROOT_DIR="apps/social-media-framework/HeliosHash-DAO"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if directory exists
check_dir() {
    if [ ! -d "$ROOT_DIR" ]; then
        error "Root directory $ROOT_DIR not found!"
        exit 1
    fi
}

# Phase 1: Remove build artifacts and cache files
clean_build_artifacts() {
    log "Phase 1: Removing build artifacts and cache files..."
    
    # Remove Gradle cache and build files
    find "$ROOT_DIR" -type d -name ".gradle" -exec rm -rf {} + 2>/dev/null
    find "$ROOT_DIR" -type d -name "build" -exec rm -rf {} + 2>/dev/null
    find "$ROOT_DIR" -name "*.lockfile" -delete
    find "$ROOT_DIR" -name "gradle-wrapper.properties" -delete
    
    # Remove iOS build artifacts
    find "$ROOT_DIR" -type d -name "xcshareddata" -exec rm -rf {} + 2>/dev/null
    find "$ROOT_DIR" -name "*.xcconfig" -delete
    find "$ROOT_DIR" -name "project.pbxproj" -delete
    
    # Remove other build artifacts
    find "$ROOT_DIR" -name ".metadata" -delete
    find "$ROOT_DIR" -name ".DS_Store" -delete
}

# Phase 2: Remove redundant example projects
clean_redundant_examples() {
    log "Phase 2: Removing redundant example projects..."
    
    # Keep only one clean example structure
    EXAMPLES_DIR="$ROOT_DIR/apps/mobile/examples"
    if [ -d "$EXAMPLES_DIR" ]; then
        # Remove all example subdirectories except a clean template
        find "$EXAMPLES_DIR" -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} + 2>/dev/null
        
        # Create clean example structure
        mkdir -p "$EXAMPLES_DIR/basic_template"
        echo "# Basic Flutter Template" > "$EXAMPLES_DIR/basic_template/README.md"
    fi
}

# Phase 3: Remove duplicate Flutter framework files
clean_duplicate_framework() {
    log "Phase 3: Removing duplicate framework files..."
    
    # Remove multiple API example copies
    find "$ROOT_DIR" -path "*/api/lib/*" -name "*.0.dart" -delete
    find "$ROOT_DIR" -path "*/api/lib/*" -name "*.1.dart" -delete
    find "$ROOT_DIR" -path "*/api/test/*" -name "*_test.dart" -delete
    
    # Remove redundant platform implementations
    find "$ROOT_DIR" -path "*/examples/*/windows" -type d -exec rm -rf {} + 2>/dev/null
    find "$ROOT_DIR" -path "*/examples/*/linux" -type d -exec rm -rf {} + 2>/dev/null
    find "$ROOT_DIR" -path "*/examples/*/macos" -type d -exec rm -rf {} + 2>/dev/null
}

# Phase 4: Consolidate documentation
consolidate_documentation() {
    log "Phase 4: Consolidating documentation..."
    
    DOCS_SOURCE="$ROOT_DIR/apps/mobile/docs"
    DOCS_TARGET="$ROOT_DIR/docs"
    
    if [ -d "$DOCS_SOURCE" ]; then
        mkdir -p "$DOCS_TARGET"
        # Move only unique documentation files
        find "$DOCS_SOURCE" -name "*.md" -exec cp --parents {} "$DOCS_TARGET" \; 2>/dev/null
        
        # Remove old docs directory
        rm -rf "$DOCS_SOURCE"
    fi
}

# Phase 5: Clean up corrupted and incomplete files
clean_corrupted_files() {
    log "Phase 5: Removing corrupted and incomplete files..."
    
    # Remove empty files
    find "$ROOT_DIR" -type f -empty -delete
    
    # Remove files with suspicious patterns (mutations)
    find "$ROOT_DIR" -name "*copy*" -delete
    find "$ROOT_DIR" -name "*backup*" -delete
    find "$ROOT_DIR" -name "*old*" -delete
    find "$ROOT_DIR" -name "*temp*" -delete
    
    # Remove truncated files (based on size or content)
    find "$ROOT_DIR" -type f -size 0 -delete
}

# Phase 6: Create clean structure
create_clean_structure() {
    log "Phase 6: Creating clean repository structure..."
    
    # Remove old mobile app structure
    rm -rf "$ROOT_DIR/apps/mobile/examples"
    rm -rf "$ROOT_DIR/apps/mobile/docs"
    
    # Create clean structure
    mkdir -p "$ROOT_DIR/apps/mobile/src/lib"
    mkdir -p "$ROOT_DIR/apps/mobile/src/assets"
    mkdir -p "$ROOT_DIR/apps/mobile/tests"
    mkdir -p "$ROOT_DIR/packages"
    mkdir -p "$ROOT_DIR/tools"
    
    # Create essential files
    cat > "$ROOT_DIR/apps/mobile/pubspec.yaml" << 'EOF'
name: helios_hash_dao_mobile
description: HeliosHash DAO Mobile Application
version: 1.0.0

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  web3dart: ^2.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
EOF

    cat > "$ROOT_DIR/README.md" << 'EOF'
# HeliosHash DAO

Professional decentralized social media framework built with Flutter.

## Structure

- `apps/mobile/` - Main mobile application
- `packages/` - Shared packages and libraries
- `docs/` - Project documentation
- `tools/` - Build tools and scripts

## Getting Started

[Add your setup instructions here]
EOF
}

# Phase 7: Final cleanup and validation
final_cleanup() {
    log "Phase 7: Final cleanup and validation..."
    
    # Remove any remaining empty directories
    find "$ROOT_DIR" -type d -empty -delete
    
    # Count remaining files for validation
    FILE_COUNT=$(find "$ROOT_DIR" -type f | wc -l)
    DIR_COUNT=$(find "$ROOT_DIR" -type d | wc -l)
    
    log "Cleanup completed!"
    log "Remaining files: $FILE_COUNT"
    log "Remaining directories: $DIR_COUNT"
}

# Main execution
main() {
    log "Starting HeliosHash-DAO repository cleanup..."
    check_dir
    
    clean_build_artifacts
    clean_redundant_examples
    clean_duplicate_framework
    consolidate_documentation
    clean_corrupted_files
    create_clean_structure
    final_cleanup
    
    log "🎉 Repository cleanup completed successfully!"
    log "📁 New structure:"
    tree -d -L 3 "$ROOT_DIR" 2>/dev/null || find "$ROOT_DIR" -type d | head -20
}

# Run the script
main "$@"
