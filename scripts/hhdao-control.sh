#!/bin/bash

echo "🚀 HeliosHash DAO Control Center"
echo "================================"

case "$1" in
    "deploy")
        echo "📦 Running deployment setup..."
        ./scripts/deployment/hhdao-setup.sh
        ;;
    "start")
        echo "🚀 Starting development environment..."
        ./scripts/deployment/start-hhdao-dev.sh
        ;;
    "maintain")
        echo "🔧 Running system maintenance..."
        ./scripts/maintenance/sys-maintain.sh
        ;;
    "backup")
        echo "💾 Creating backup..."
        ./scripts/maintenance/backup-dev-files.sh
        ;;
    "update")
        echo "🔄 Updating development tools..."
        ./scripts/maintenance/update-dev-tools.sh
        ;;
    "clean")
        echo "🧹 Cleaning repository..."
        ./scripts/maintenance/cleanup_repo.sh
        ;;
    "diagnose")
        echo "🔍 Running system diagnosis..."
        ./scripts/maintenance/fedora_diagnostic.sh
        ;;
    "monitor")
        echo "📊 Starting maintenance monitor..."
        ./scripts/maintenance/maintenance-monitor.sh
        ;;
    "docs")
        echo "📚 Opening documentation..."
        ls -la docs/external/
        ;;
    "security")
        echo "🔒 Security configurations..."
        ls -la security/external-setup/
        ;;
    *)
        echo "Usage: $0 {deploy|start|maintain|backup|update|clean|diagnose|monitor|docs|security}"
        echo ""
        echo "Available commands:"
        echo "  deploy    - Run deployment setup"
        echo "  start     - Start development environment"
        echo "  maintain  - Run system maintenance"
        echo "  backup    - Create backup"
        echo "  update    - Update development tools"
        echo "  clean     - Clean repository"
        echo "  diagnose  - Run system diagnosis"
        echo "  monitor   - Start maintenance monitor"
        echo "  docs      - Show documentation"
        echo "  security  - Show security configurations"
        ;;
esac
