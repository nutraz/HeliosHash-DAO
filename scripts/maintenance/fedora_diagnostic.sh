#!/bin/bash

# Fedora OS Comprehensive Diagnostic Script
# Run with: bash fedora_diagnostic.sh

echo "=================================================="
echo "           FEDORA OS DIAGNOSTIC REPORT"
echo "=================================================="
echo "Generated on: $(date)"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
section() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Function to check status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
    fi
}

# Function to get package count
package_count() {
    echo $(dnf list installed 2>/dev/null | wc -l)
}

section "SYSTEM INFORMATION"
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime -p)"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"
echo "Fedora Version: $(cat /etc/fedora-release 2>/dev/null || echo "Not available")"

section "HARDWARE INFORMATION"
echo "CPU: $(grep "model name" /proc/cpuinfo | head -1 | cut -d: -f2 | xargs)"
echo "CPU Cores: $(nproc)"
echo "RAM: $(free -h | grep Mem: | awk '{print $2}') Total"
echo "Disk: $(lsblk -o SIZE,MODEL -d -n | head -1 | xargs)"
echo "GPU: $(lspci | grep -i vga | cut -d: -f3 | xargs)"

section "MEMORY USAGE"
free -h

section "DISK USAGE"
df -h / /home /boot

section "NETWORK INFORMATION"
echo "IP Addresses:"
ip -4 addr show | grep inet | awk '{print $2}' | head -5
echo -e "\nNetwork Interfaces:"
ip link show | grep "^[0-9]:" | awk -F: '{print $2}' | head -5

section "PACKAGE MANAGEMENT"
echo "DNF Version: $(dnf --version 2>/dev/null | head -1 || echo "DNF not available")"
echo "Installed Packages: $(package_count)"
echo "Available Updates: $(dnf check-update --quiet 2>/dev/null | grep -c . || echo "0")"

section "SERVICES STATUS"
important_services=("sshd" "firewalld" "NetworkManager" "docker" "postgresql" "mysql" "nginx" "httpd")
for service in "${important_services[@]}"; do
    if systemctl is-active --quiet "$service" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $service: $(systemctl is-active $service 2>/dev/null)"
    elif systemctl is-enabled --quiet "$service" 2>/dev/null; then
        echo -e "${YELLOW}○${NC} $service: $(systemctl is-enabled $service 2>/dev/null) but not running"
    fi
done

section "SECURITY CHECKS"
echo "SELinux Status: $(getenforce 2>/dev/null || echo "Not available")"
echo "Firewall Status: $(firewall-cmd --state 2>/dev/null || echo "Not active")"
echo "Failed Login Attempts (last 24h): $(journalctl --since "24 hours ago" | grep "Failed password" | wc -l)"

section "USER INFORMATION"
echo "Current User: $(whoami)"
echo "Users logged in:"
who
echo -e "\nSudoers access: $(if sudo -l >/dev/null 2>&1; then echo "Yes"; else echo "No"; fi)"

section "PROCESS INFORMATION"
echo "Top 5 CPU-consuming processes:"
ps aux --sort=-%cpu | head -6
echo -e "\nTop 5 memory-consuming processes:"
ps aux --sort=-%mem | head -6

section "DOCKER STATUS"
if command -v docker &> /dev/null; then
    echo "Docker Version: $(docker --version 2>/dev/null | cut -d' ' -f3 | cut -d',' -f1)"
    echo "Containers: $(docker ps -q 2>/dev/null | wc -l) running, $(docker ps -a -q 2>/dev/null | wc -l) total"
    echo "Images: $(docker images -q 2>/dev/null | wc -l)"
else
    echo "Docker not installed"
fi

section "NODE.JS & DEVELOPMENT TOOLS"
if command -v node &> /dev/null; then
    echo "Node.js: $(node --version)"
    echo "NPM: $(npm --version)"
    echo "PNPM: $(pnpm --version 2>/dev/null || echo "Not installed")"
    echo "Yarn: $(yarn --version 2>/dev/null || echo "Not installed")"
else
    echo "Node.js not installed"
fi

section "GIT INFORMATION"
if command -v git &> /dev/null; then
    echo "Git Version: $(git --version)"
    echo "Git User: $(git config --global user.name 2>/dev/null || echo "Not configured")"
    echo "Git Email: $(git config --global user.email 2>/dev/null || echo "Not configured")"
else
    echo "Git not installed"
fi

section "BASH & SHELL INFORMATION"
echo "Bash Version: $BASH_VERSION"
echo "Shell: $SHELL"
echo "Current Directory: $PWD"
echo "Home Directory: $HOME"

section "ENVIRONMENT VARIABLES"
echo "PATH contains Node.js: $(echo $PATH | grep -q node && echo "Yes" || echo "No")"
echo "EDITOR: ${EDITOR:-Not set}"
echo "LANG: ${LANG:-Not set}"

section "SYSTEM LOGS (LAST ERRORS)"
journalctl --since "1 hour ago" --priority=3 | tail -5

section "PERFORMANCE METRICS"
echo "Load Average: $(cat /proc/loadavg | cut -d' ' -f1-3)"
echo "Memory Usage: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100}')"
echo "Swap Usage: $(free | grep Swap | awk '{if ($2 == 0) print "0%"; else printf "%.1f%%", $3/$2 * 100}')"

section "RECOMMENDATIONS"
# Check for common issues
if [ $(package_count) -lt 1000 ]; then
    echo -e "${YELLOW}• Very few packages installed. Consider installing essential development tools.${NC}"
fi

if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}• Git is not installed. Install with: sudo dnf install git${NC}"
fi

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}• Node.js is not installed. Consider installing for development.${NC}"
fi

if [ $(df / --output=pcent | tail -1 | tr -d '% ') -gt 90 ]; then
    echo -e "${RED}• Root partition is over 90% full. Consider cleaning up disk space.${NC}"
fi

if [ $(free | grep Mem | awk '{print $3/$2 * 100}') -gt 90 ]; then
    echo -e "${RED}• Memory usage is over 90%. Consider closing some applications.${NC}"
fi

# Check if running in VM
if [[ $(systemd-detect-virt 2>/dev/null) != "none" ]]; then
    echo -e "${BLUE}• Running in virtualized environment: $(systemd-detect-virt)${NC}"
fi

section "QUICK FIXES FOR COMMON ISSUES"
echo "1. Update system: sudo dnf update"
echo "2. Clean package cache: sudo dnf clean all"
echo "3. Check disk space: sudo du -sh /home/* /var/* 2>/dev/null | sort -hr"
echo "4. Check for broken packages: sudo dnf check"
echo "5. Restart failed services: sudo systemctl --failed"

echo -e "\n${GREEN}==================================================${NC}"
echo -e "${GREEN}           DIAGNOSTIC COMPLETE${NC}"
echo -e "${GREEN}==================================================${NC}"

# Save to file
REPORT_FILE="fedora_diagnostic_$(hostname)_$(date +%Y%m%d_%H%M%S).txt"
echo "Full report saved to: $REPORT_FILE"

# Re-run and save to file
{
echo "=================================================="
echo "           FEDORA OS DIAGNOSTIC REPORT"
echo "=================================================="
echo "Generated on: $(date)"
echo "Hostname: $(hostname)"
echo "=================================================="
} > "$REPORT_FILE"

# Append all sections to file
{
free -h
echo -e "\n=== DISK USAGE ==="
df -h
echo -e "\n=== SERVICES ==="
systemctl list-units --type=service --state=running | head -10
echo -e "\n=== INSTALLED PACKAGES COUNT ==="
package_count
echo -e "\n=== DOCKER INFO ==="
docker info 2>/dev/null | head -20
echo -e "\n=== NODE INFO ==="
node --version 2>/dev/null
npm --version 2>/dev/null
} >> "$REPORT_FILE" 2>/dev/null

echo -e "\n${GREEN}Use 'cat $REPORT_FILE' to view the full report${NC}"
