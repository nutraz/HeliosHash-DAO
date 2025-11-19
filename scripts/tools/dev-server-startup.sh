#!/bin/bash

# HeliosHash DAO - Development Server Startup & Port Verification
# This script manages all development services and verifies connectivity

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$PROJECT_DIR/logs"
timestamp=$(date '+%Y%m%d_%H%M%S')
LOG_FILE="$LOG_DIR/dev-startup-$timestamp.log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# LOGGING FUNCTIONS
# ============================================================================

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_success() {
  echo -e "${GREEN}✓${NC} [$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_error() {
  echo -e "${RED}✗${NC} [$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_info() {
  echo -e "${BLUE}ℹ${NC} [$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} [$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# ============================================================================
# PORT CONFIGURATION
# ============================================================================

declare -A SERVICES=(
  ["backend-api"]="3001"
  ["frontend-web"]="3000"
  ["dfx-network"]="4943"
  ["postgres"]="5432"
  ["redis"]="6379"
  ["next-dev"]="3000"
)

declare -A SERVICE_COMMANDS=(
  ["backend"]="pnpm run dev --filter=helioshash_backend"
  ["web"]="pnpm run dev --filter=web"
  ["dfx"]="dfx start"
)

# ============================================================================
# PORT CHECKING FUNCTIONS
# ============================================================================

check_port_available() {
  local port=$1
  local service_name=$2
  
  if netstat -tuln 2>/dev/null | grep -q ":$port "; then
    log_success "Port $port ($service_name) is LISTENING"
    return 0
  else
    log_warning "Port $port ($service_name) is NOT listening yet"
    return 1
  fi
}

check_all_ports() {
  log_info "Checking service ports..."
  local all_good=true
  
  for service in "${!SERVICES[@]}"; do
    port="${SERVICES[$service]}"
    if ! check_port_available "$port" "$service"; then
      all_good=false
    fi
  done
  
  return $([ "$all_good" = true ] && echo 0 || echo 1)
}

# ============================================================================
# DATABASE CONNECTION FUNCTIONS
# ============================================================================

check_database_connection() {
  log_info "Checking database connection..."
  
  cd "$PROJECT_DIR"
  
  if command -v prisma &> /dev/null; then
    if pnpm exec prisma db push --skip-generate 2>&1 | tee -a "$LOG_FILE"; then
      log_success "Database connection successful"
      return 0
    else
      log_error "Database connection failed"
      return 1
    fi
  else
    log_warning "Prisma not found, skipping database check"
    return 0
  fi
}

run_db_migrations() {
  log_info "Running database migrations..."
  
  cd "$PROJECT_DIR"
  
  if pnpm exec prisma migrate deploy 2>&1 | tee -a "$LOG_FILE"; then
    log_success "Migrations completed successfully"
    return 0
  else
    log_warning "Migration check completed (may need manual review)"
    return 0
  fi
}

# ============================================================================
# SERVICE STARTUP FUNCTIONS
# ============================================================================

start_service() {
  local service_name=$1
  local command=$2
  local port=$3
  
  log_info "Starting $service_name..."
  
  # Start service in background
  nohup bash -c "cd $PROJECT_DIR && $command" > "$LOG_DIR/${service_name}-output.log" 2>&1 &
  local pid=$!
  
  echo $pid > "$LOG_DIR/${service_name}.pid"
  log "Started $service_name (PID: $pid)"
  
  # Wait for port to be available (max 30 seconds)
  local wait_time=0
  while [ $wait_time -lt 30 ]; do
    if check_port_available "$port" "$service_name"; then
      log_success "$service_name is ready on port $port"
      return 0
    fi
    sleep 2
    wait_time=$((wait_time + 2))
  done
  
  log_error "$service_name failed to start within 30 seconds"
  return 1
}

# ============================================================================
# HEALTH CHECK FUNCTIONS
# ============================================================================

health_check_endpoint() {
  local url=$1
  local service_name=$2
  
  if curl -s "$url" > /dev/null 2>&1; then
    log_success "Health check passed: $service_name ($url)"
    return 0
  else
    log_warning "Health check failed: $service_name ($url)"
    return 1
  fi
}

run_health_checks() {
  log_info "Running health checks..."
  
  health_check_endpoint "http://localhost:3000" "Frontend Web"
  health_check_endpoint "http://localhost:3001/health" "Backend API"
  
  return 0
}

# ============================================================================
# DEPENDENCY CHECK
# ============================================================================

check_dependencies() {
  log_info "Checking dependencies..."
  
  local missing_deps=false
  
  # Check Node.js
  if command -v node &> /dev/null; then
    log_success "Node.js: $(node --version)"
  else
    log_error "Node.js not found"
    missing_deps=true
  fi
  
  # Check pnpm
  if command -v pnpm &> /dev/null; then
    log_success "pnpm: $(pnpm --version)"
  else
    log_error "pnpm not found"
    missing_deps=true
  fi
  
  # Check dfx
  if command -v dfx &> /dev/null; then
    log_success "dfx: $(dfx --version 2>/dev/null || echo 'installed')"
  else
    log_warning "dfx not found (optional)"
  fi
  
  # Check Docker
  if command -v docker &> /dev/null; then
    log_success "Docker: $(docker --version)"
  else
    log_warning "Docker not found (optional)"
  fi
  
  if [ "$missing_deps" = true ]; then
    log_error "Missing critical dependencies"
    return 1
  fi
  
  return 0
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
  log_info "=== HeliosHash DAO Development Server Startup ==="
  log_info "Project directory: $PROJECT_DIR"
  log_info "Log file: $LOG_FILE"
  
  # Check dependencies
  if ! check_dependencies; then
    log_error "Dependency check failed"
    return 1
  fi
  
  # Install dependencies if needed
  if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    log_info "Installing dependencies..."
    cd "$PROJECT_DIR"
    if pnpm install 2>&1 | tee -a "$LOG_FILE"; then
      log_success "Dependencies installed"
    else
      log_error "Dependency installation failed"
      return 1
    fi
  fi
  
  # Check database connection
  if check_database_connection; then
    run_db_migrations
  fi
  
  # Check if services are already running
  log_info "Checking for already running services..."
  check_all_ports
  
  # Generate status report
  log_info ""
  log_info "=== DEVELOPMENT ENVIRONMENT STATUS ==="
  
  cat >> "$LOG_FILE" << 'EOF'

SERVICE PORTS:
EOF
  
  for service in "${!SERVICES[@]}"; do
    port="${SERVICES[$service]}"
    echo "  $service: localhost:$port" >> "$LOG_FILE"
  done
  
  # Show important URLs
  log_info ""
  log_info "=== IMPORTANT URLS ==="
  log "Frontend Web:     http://localhost:3000"
  log "Backend API:      http://localhost:3001"
  log "DFX Network:      http://localhost:4943"
  log "DFX Canister UI:  http://localhost:8080"
  
  # Show next steps
  log_info ""
  log_info "=== NEXT STEPS ==="
  log "1. Start individual services using:"
  log "   - Backend: pnpm run dev --filter=helioshash_backend"
  log "   - Web:     pnpm run dev --filter=web"
  log "   - DFX:     dfx start"
  log ""
  log "2. Monitor logs:"
  log "   tail -f $LOG_DIR/[service]-output.log"
  log ""
  log "3. View this startup log:"
  log "   cat $LOG_FILE"
  
  return 0
}

# Run main function
main "$@"
exit $?
