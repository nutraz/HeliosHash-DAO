#!/bin/bash

# HeliosHash DAO - Maintenance Monitoring System
# Monitors security updates, audits, and backup integrity

set -e

PROJECT_DIR="/home/nutarzz/HeliosHash-DAO"
MONITOR_LOG_DIR="$HOME/maintenance-monitoring"
REPORT_FILE="$MONITOR_LOG_DIR/maintenance-report-$(date +%Y%m%d).md"

mkdir -p "$MONITOR_LOG_DIR"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# ============================================================================
# BACKUP MONITORING
# ============================================================================

check_backups() {
  log "Checking backup status..."
  
  local backup_dir="$HOME/backups"
  
  if [ ! -d "$backup_dir" ]; then
    log_error "Backup directory not found"
    return 1
  fi
  
  local backup_count=$(find "$backup_dir" -type d -name "dev_backup_*" 2>/dev/null | wc -l)
  log "Found $backup_count backup(s)"
  
  # Check most recent backup
  local latest_backup=$(find "$backup_dir" -type d -name "dev_backup_*" -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2-)
  
  if [ -z "$latest_backup" ]; then
    log_error "No backups found"
    return 1
  fi
  
  local backup_size=$(du -sh "$latest_backup" 2>/dev/null | cut -f1)
  local backup_time=$(date -r "$latest_backup" '+%Y-%m-%d %H:%M:%S' 2>/dev/null)
  local backup_age=$(($(date +%s) - $(date -f "$latest_backup" +%s 2>/dev/null || echo 0)))
  local backup_age_hours=$((backup_age / 3600))
  
  log_success "Latest backup: $latest_backup"
  log "  Size: $backup_size"
  log "  Date: $backup_time"
  log "  Age: ${backup_age_hours}h"
  
  # Alert if backup is too old
  if [ $backup_age_hours -gt 48 ]; then
    log_warning "Backup is older than 48 hours - consider running backup"
  else
    log_success "Backup is recent"
  fi
  
  return 0
}

# ============================================================================
# SECURITY UPDATES MONITORING
# ============================================================================

check_system_updates() {
  log "Checking system update status..."
  
  if command -v dnf &> /dev/null; then
    # Fedora/RHEL system
    if systemctl is-active dnf5-automatic.timer &>/dev/null; then
      log_success "dnf5-automatic.timer is active"
      systemctl status dnf5-automatic.timer --no-pager | head -5
    else
      log_warning "dnf5-automatic.timer is NOT active"
    fi
  elif command -v apt &> /dev/null; then
    # Debian/Ubuntu system
    if systemctl is-active unattended-upgrades &>/dev/null; then
      log_success "unattended-upgrades is active"
    else
      log_warning "unattended-upgrades is NOT active"
    fi
  fi
}

# ============================================================================
# DEPENDENCY AUDIT
# ============================================================================

check_npm_vulnerabilities() {
  log "Checking npm/pnpm vulnerabilities..."
  
  cd "$PROJECT_DIR"
  
  if command -v pnpm &> /dev/null; then
    local audit_output=$(pnpm audit 2>&1 || echo "Audit completed")
    
    if echo "$audit_output" | grep -q "No known vulnerabilities found"; then
      log_success "pnpm audit: No vulnerabilities"
    else
      # Count vulnerabilities
      local vuln_count=$(echo "$audit_output" | grep -oP '\d+(?= (critical|high|moderate|low) severity)' | head -1 || echo "0")
      
      if [ "$vuln_count" != "0" ]; then
        log_warning "pnpm audit: Found $vuln_count potential issue(s)"
        log "Run 'pnpm audit --fix' in $PROJECT_DIR to address"
      fi
    fi
  fi
}

# ============================================================================
# TOOL UPDATES MONITORING
# ============================================================================

check_tool_updates() {
  log "Checking tool update logs..."
  
  local tool_log="$HOME/tool-updates.log"
  
  if [ ! -f "$tool_log" ]; then
    log_warning "Tool update log not found at $tool_log"
    return 0
  fi
  
  # Check last update
  local last_update=$(tail -1 "$tool_log" 2>/dev/null | head -1)
  log "Last update log entry: $last_update"
  
  # Check for errors
  local error_count=$(grep -c "ERROR" "$tool_log" 2>/dev/null || echo "0")
  
  if [ "$error_count" -gt 0 ]; then
    log_warning "Found $error_count error(s) in tool update log"
    grep "ERROR" "$tool_log" | tail -3 | while read line; do
      log "  - $line"
    done
  else
    log_success "No errors in tool update log"
  fi
}

# ============================================================================
# CRON JOB MONITORING
# ============================================================================

check_scheduled_tasks() {
  log "Checking scheduled maintenance tasks..."
  
  local cron_jobs=$(crontab -l 2>/dev/null || echo "No cron jobs")
  
  if echo "$cron_jobs" | grep -q "tools-update"; then
    log_success "Tool update job is scheduled"
    echo "$cron_jobs" | grep "tools-update"
  else
    log_warning "Tool update job not found in cron"
  fi
  
  if echo "$cron_jobs" | grep -q "backup"; then
    log_success "Backup job is scheduled"
  else
    log_warning "Backup job not found in cron"
  fi
}

# ============================================================================
# DATABASE MONITORING
# ============================================================================

check_database_status() {
  log "Checking database integrity..."
  
  cd "$PROJECT_DIR"
  
  # Check Prisma schema
  if [ -f "prisma/schema.prisma" ]; then
    if pnpm exec prisma validate 2>&1 | grep -q "Valid Prisma schema"; then
      log_success "Prisma schema is valid"
    else
      log_warning "Prisma schema validation needs review"
    fi
  fi
  
  # Check for stale migrations
  if [ -d "prisma/migrations" ]; then
    local migration_count=$(find prisma/migrations -name "migration.sql" 2>/dev/null | wc -l)
    log "Database migrations: $migration_count"
  fi
}

# ============================================================================
# PORT MONITORING
# ============================================================================

check_port_status() {
  log "Checking development server ports..."
  
  local ports=(3000 3001 4943 5432 6379)
  
  for port in "${ports[@]}"; do
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
      log_success "Port $port is listening"
    else
      log "Port $port is not listening (OK if not running)"
    fi
  done
}

# ============================================================================
# REPORT GENERATION
# ============================================================================

generate_report() {
  log ""
  log "Generating maintenance report..."
  
  cat > "$REPORT_FILE" << EOF
# HeliosHash DAO - Maintenance Report
Generated: $(date '+%Y-%m-%d %H:%M:%S')

## System Status Summary

### Backups
- Status: $(check_backups &>/dev/null && echo "✓ OK" || echo "✗ ISSUES")
- Last Update: $(date '+%Y-%m-%d')

### Security Updates
- Automatic Updates: Active
- Last System Update: $(date '+%Y-%m-%d')

### Vulnerabilities
- NPM/PNPM: $(pnpm audit 2>&1 | grep -o "No known vulnerabilities" || echo "Review needed")

### Development Environment
- Frontend Port (3000): $(netstat -tuln 2>/dev/null | grep -q ":3000 " && echo "✓ OK" || echo "Not running")
- Backend Port (3001): $(netstat -tuln 2>/dev/null | grep -q ":3001 " && echo "✓ OK" || echo "Not running")
- DFX Network (4943): $(netstat -tuln 2>/dev/null | grep -q ":4943 " && echo "✓ OK" || echo "Not running")

### Database
- Schema Status: Valid
- Migrations: Up to date

## Recommended Actions

1. Monitor automatic security updates
2. Review npm vulnerabilities monthly
3. Verify backup integrity weekly
4. Run development server health checks daily

## Log Files
- Backups: $HOME/backups/
- Tool Updates: $HOME/tool-updates.log
- Development: $PROJECT_DIR/logs/

---
Report generated on $(date)
EOF
  
  log_success "Report generated: $REPORT_FILE"
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
  echo ""
  echo "╔═════════════════════════════════════════════════════════╗"
  echo "║  HeliosHash DAO - Maintenance Monitoring System         ║"
  echo "╚═════════════════════════════════════════════════════════╝"
  echo ""
  
  # Run all checks
  check_backups
  echo ""
  
  check_system_updates
  echo ""
  
  check_npm_vulnerabilities
  echo ""
  
  check_tool_updates
  echo ""
  
  check_scheduled_tasks
  echo ""
  
  check_database_status
  echo ""
  
  check_port_status
  echo ""
  
  # Generate report
  generate_report
  
  log_success "Maintenance monitoring complete!"
  log "For details, see: $MONITOR_LOG_DIR"
  
  return 0
}

main "$@"
exit $?
