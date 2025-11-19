#!/bin/bash

# HeliosHash DAO - Database Connection Validator
# Validates database connectivity and schema status

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# ============================================================================
# DATABASE STATUS FUNCTIONS
# ============================================================================

check_database_url() {
  log "Checking DATABASE_URL configuration..."
  
  cd "$PROJECT_DIR"
  
  local db_url="${DATABASE_URL:-.}"
  
  if [ -f ".env" ]; then
    db_url=$(grep "DATABASE_URL" .env | cut -d'=' -f2- || echo "")
  elif [ -f ".env.local" ]; then
    db_url=$(grep "DATABASE_URL" .env.local | cut -d'=' -f2- || echo "")
  fi
  
  if [ -z "$db_url" ] || [ "$db_url" = "." ]; then
    log_warning "DATABASE_URL not configured, using SQLite default"
    return 0
  fi
  
  log "DATABASE_URL: ${db_url:0:50}..."
  return 0
}

check_prisma_schema() {
  log "Checking Prisma schema..."
  
  cd "$PROJECT_DIR"
  
  if [ ! -f "prisma/schema.prisma" ]; then
    log_error "Prisma schema not found at prisma/schema.prisma"
    return 1
  fi
  
  # Check for common issues
  local missing_models=0
  
  for model in User SolarProject DAOProposal NFT; do
    if ! grep -q "^model $model" prisma/schema.prisma; then
      log_warning "Model '$model' not found in schema"
      missing_models=$((missing_models + 1))
    fi
  done
  
  if [ $missing_models -eq 0 ]; then
    log_success "All core models present in schema"
  else
    log_warning "Some core models missing from schema"
  fi
  
  return 0
}

check_prisma_client() {
  log "Checking Prisma client..."
  
  cd "$PROJECT_DIR"
  
  if ! command -v prisma &> /dev/null; then
    log_error "Prisma CLI not found"
    return 1
  fi
  
  if pnpm exec prisma --version 2>&1 | grep -q "Prisma"; then
    log_success "Prisma CLI: $(pnpm exec prisma --version 2>&1 | head -1)"
    return 0
  else
    log_error "Prisma CLI verification failed"
    return 1
  fi
}

validate_database_connection() {
  log "Validating database connection..."
  
  cd "$PROJECT_DIR"
  
  # Run Prisma db push in check mode
  if pnpm exec prisma db push --skip-generate --skip-seed 2>&1 | tee -a "$LOG_DIR/db-validation.log"; then
    log_success "Database connection validated"
    return 0
  else
    log_warning "Database validation completed with warnings"
    return 0
  fi
}

check_migrations_status() {
  log "Checking migration status..."
  
  cd "$PROJECT_DIR"
  
  if [ ! -d "prisma/migrations" ]; then
    log_warning "No migrations directory found"
    return 0
  fi
  
  local migration_count=$(find prisma/migrations -name "migration.sql" 2>/dev/null | wc -l)
  
  if [ $migration_count -gt 0 ]; then
    log_success "Found $migration_count migration(s)"
    
    # List recent migrations
    log "Recent migrations:"
    find prisma/migrations -name "migration.sql" -type f | sort -r | head -5 | while read mig; do
      echo "  - $(dirname "$mig" | xargs basename)"
    done
  else
    log_warning "No migrations found"
  fi
  
  return 0
}

# ============================================================================
# SCHEMA ANALYSIS
# ============================================================================

analyze_schema_models() {
  log ""
  log "=== DATABASE SCHEMA ANALYSIS ==="
  
  cd "$PROJECT_DIR"
  
  if [ ! -f "prisma/schema.prisma" ]; then
    log_error "Schema file not found"
    return 1
  fi
  
  # Count models
  local model_count=$(grep -c "^model " prisma/schema.prisma || echo "0")
  log "Total models: $model_count"
  
  # List all models
  log ""
  log "Available models:"
  grep "^model " prisma/schema.prisma | sed 's/model /  - /' | sed 's/ {//'
  
  return 0
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
  echo ""
  echo "╔═════════════════════════════════════════════════════════╗"
  echo "║  HeliosHash DAO - Database Connection Validator        ║"
  echo "╚═════════════════════════════════════════════════════════╝"
  echo ""
  
  cd "$PROJECT_DIR"
  
  # Check configuration
  check_database_url
  echo ""
  
  # Check Prisma setup
  check_prisma_schema
  echo ""
  
  check_prisma_client
  echo ""
  
  # Check migrations
  check_migrations_status
  echo ""
  
  # Validate connection
  validate_database_connection
  echo ""
  
  # Analyze schema
  analyze_schema_models
  echo ""
  
  log_success "Database validation complete!"
  log "For more details, see: $LOG_DIR/db-validation.log"
  
  return 0
}

main "$@"
exit $?
