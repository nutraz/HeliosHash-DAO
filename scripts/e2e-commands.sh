#!/bin/bash

# HeliosHash DAO E2E Command Shortcuts
# Usage: source scripts/e2e-commands.sh

export HHDAO_E2E_DIR="$HOME/HeliosHash-DAO/apps/web"

# Quick test commands
e2e-quick() {
  cd $HHDAO_E2E_DIR
  pnpm test:e2e:quick
}

e2e-full() {
  cd $HHDAO_E2E_DIR  
  pnpm test:e2e:production
}

e2e-report() {
  cd $HHDAO_E2E_DIR
  pnpm test:e2e:report
}

e2e-analytics() {
  cd $HHDAO_E2E_DIR
  node e2e/test-analytics.js
}

e2e-monitor() {
  cd $HHDAO_E2E_DIR
  node e2e/monitoring-dashboard.js
}

e2e-ci() {
  cd $HHDAO_E2E_DIR
  ./scripts/run-production-e2e.sh
}

# Show available commands
e2e-help() {
  echo "🚀 HeliosHash DAO E2E Commands:"
  echo "  e2e-quick     - Run quick smoke tests (~30s)"
  echo "  e2e-full      - Run full production suite (~25s)" 
  echo "  e2e-report    - Open HTML test report"
  echo "  e2e-analytics - Show test analytics"
  echo "  e2e-monitor   - Show monitoring dashboard"
  echo "  e2e-ci        - Run CI-ready test suite"
  echo "  e2e-help      - Show this help"
}

echo "✅ HeliosHash DAO E2E commands loaded!"
echo "Type 'e2e-help' to see available commands"
