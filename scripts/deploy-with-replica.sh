#!/bin/bash

set -e

echo "🚀 Starting HHDAO Deployment with Replica Management"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Resolve script/project paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Logging
LOG_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOG_DIR"
REPLICA_LOG="$LOG_DIR/replica-$(date +%Y%m%d_%H%M%S).log"

log() {
    local level="$1"
    local message="$2"
    local color="$3"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo -e "${color}[$timestamp] $level: $message${NC}"
    echo "[$timestamp] $level: $message" >> "$REPLICA_LOG"
}

# Function to check if replica is running
check_replica() {
    if timeout 10 dfx ping > /dev/null 2>&1; then
        log "INFO" "DFX replica is running" "$GREEN"
        return 0
    else
        log "WARN" "DFX replica is not running or not responsive" "$YELLOW"
        return 1
    fi
}

# Function to start replica
start_replica() {
    log "INFO" "Starting DFX replica..." "$YELLOW"
    
    # Stop any existing replica
    log "INFO" "Stopping any existing replica..." "$YELLOW"
    dfx stop >> "$REPLICA_LOG" 2>&1 || true
    
    # Start fresh replica
    log "INFO" "Starting clean replica in background..." "$YELLOW"
    dfx start --background --clean >> "$REPLICA_LOG" 2>&1
    
    # Wait for replica to be ready
    log "INFO" "Waiting for replica to be ready..." "$YELLOW"
    local attempts=0
    local max_attempts=30
    
    while [ $attempts -lt $max_attempts ]; do
        if check_replica; then
            log "INFO" "Replica started successfully" "$GREEN"
            return 0
        fi
        sleep 2
        attempts=$((attempts + 1))
    done
    
    log "ERROR" "Failed to start replica after $max_attempts attempts" "$RED"
    log "INFO" "Check replica log: $REPLICA_LOG" "$YELLOW"
    return 1
}

# Function to show replica status
show_replica_status() {
    log "INFO" "Current replica status:" "$BLUE"
    echo "=== DFX Processes ==="
    ps aux | grep -E "[d]fx|[r]eplica" || echo "No DFX processes found"
    
    echo "=== Network Ports ==="
    netstat -tulpn 2>/dev/null | grep -E "8000|4943" || echo "No DFX ports found"
    
    echo "=== Canister Status ==="
    dfx canister status frontend 2>/dev/null || echo "Frontend canister not deployed"
}

# Main deployment
main() {
    log "INFO" "Starting deployment process" "$GREEN"
    
    # Show initial status
    show_replica_status
    
    # Check if replica is running, start if not
    if ! check_replica; then
        log "INFO" "Starting replica..." "$YELLOW"
        if ! start_replica; then
            log "ERROR" "Failed to start replica. Cannot proceed with deployment." "$RED"
            exit 1
        fi
    else
        log "INFO" "Replica is already running" "$GREEN"
    fi
    
    # Run the frontend deployment
    log "INFO" "Starting frontend deployment..." "$YELLOW"
    # invoke deploy script from project root using absolute path
    if "$PROJECT_ROOT/deploy-web-canister.sh"; then
        log "INFO" "Frontend deployment completed successfully" "$GREEN"
        
        # Final status check
        echo ""
        log "INFO" "Final Deployment Status:" "$BLUE"
        show_replica_status
        
        CANISTER_ID=$(dfx canister id frontend 2>/dev/null || echo "Unknown")
        log "INFO" "🌐 Your frontend is live at: http://$CANISTER_ID.localhost:8000" "$GREEN"
        log "INFO" "📊 Check logs in: ./logs/" "$BLUE"
    else
        log "ERROR" "Frontend deployment failed" "$RED"
        exit 1
    fi
}

main "$@"
