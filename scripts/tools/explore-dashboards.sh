#!/bin/bash
# Dashboard Explorer Script
# Quick access to standalone dashboard projects

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║    HeliosHash DAO - Dashboard Explorer            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════╝${NC}"
echo

# Function to check if directory exists
check_dashboard() {
    local path=$1
    local name=$2
    if [ -d "$path" ]; then
        echo -e "${GREEN}✓${NC} Found: $name"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $name"
        return 1
    fi
}

# Discover dashboards
echo -e "${YELLOW}Discovering dashboards...${NC}"
echo

URGAMU_PATH="$PROJECT_ROOT/urgamu-project-dashboard"
BAGHPAT_PATH="$PROJECT_ROOT/helios#baghpat-dao-village-dashboard"

check_dashboard "$URGAMU_PATH" "Urgamu Project Dashboard"
check_dashboard "$BAGHPAT_PATH" "Helios#Baghpat Village Dashboard"

echo
echo -e "${CYAN}Available Commands:${NC}"
echo
echo "1) Launch Urgamu Dashboard (Financial & Governance)"
echo "2) Launch Baghpat Dashboard (Live IoT & Community)"
echo "3) Show Urgamu Components"
echo "4) Show Baghpat Components"
echo "5) Compare Dashboard Dependencies"
echo "6) View Integration Guide"
echo "7) Exit"
echo

read -p "Select option (1-7): " choice

case $choice in
    1)
        echo -e "${GREEN}Launching Urgamu Project Dashboard...${NC}"
        cd "$URGAMU_PATH"
        echo -e "${YELLOW}Installing dependencies...${NC}"
        pnpm install
        echo -e "${CYAN}Starting dev server...${NC}"
        pnpm dev
        ;;
    2)
        echo -e "${GREEN}Launching Baghpat Village Dashboard...${NC}"
        cd "$BAGHPAT_PATH"
        echo -e "${YELLOW}Installing dependencies...${NC}"
        pnpm install
        echo -e "${CYAN}Starting dev server...${NC}"
        pnpm dev
        ;;
    3)
        echo -e "${CYAN}Urgamu Dashboard Components:${NC}"
        echo
        if [ -d "$URGAMU_PATH/components" ]; then
            ls -1 "$URGAMU_PATH/components" | while read file; do
                echo -e "  ${GREEN}•${NC} $file"
                if [ -f "$URGAMU_PATH/components/$file" ]; then
                    lines=$(wc -l < "$URGAMU_PATH/components/$file")
                    echo -e "    ${YELLOW}Lines:${NC} $lines"
                fi
            done
        fi
        echo
        echo -e "${CYAN}Key Data Files:${NC}"
        if [ -f "$URGAMU_PATH/constants.tsx" ]; then
            lines=$(wc -l < "$URGAMU_PATH/constants.tsx")
            echo -e "  ${GREEN}•${NC} constants.tsx (${YELLOW}$lines lines${NC})"
            echo "    - Financial data (exchange rates, costs)"
            echo "    - DAO governance tiers"
            echo "    - Tokenomics structures"
        fi
        ;;
    4)
        echo -e "${CYAN}Baghpat Dashboard Components:${NC}"
        echo
        if [ -d "$BAGHPAT_PATH/components" ]; then
            ls -1 "$BAGHPAT_PATH/components" | while read file; do
                echo -e "  ${GREEN}•${NC} $file"
                if [ -f "$BAGHPAT_PATH/components/$file" ]; then
                    lines=$(wc -l < "$BAGHPAT_PATH/components/$file")
                    echo -e "    ${YELLOW}Lines:${NC} $lines"
                fi
            done
        fi
        echo
        echo -e "${YELLOW}Integration Status:${NC} ✓ Partially integrated in main web app"
        echo "  Route: apps/web/src/app/projects/helios-baghpat/"
        ;;
    5)
        echo -e "${CYAN}Dashboard Dependencies Comparison:${NC}"
        echo
        echo -e "${GREEN}Urgamu Dashboard:${NC}"
        if [ -f "$URGAMU_PATH/package.json" ]; then
            grep -A 10 '"dependencies"' "$URGAMU_PATH/package.json" | grep -v dependencies | grep -v '^--$' || true
        fi
        echo
        echo -e "${GREEN}Baghpat Dashboard:${NC}"
        if [ -f "$BAGHPAT_PATH/package.json" ]; then
            grep -A 10 '"dependencies"' "$BAGHPAT_PATH/package.json" | grep -v dependencies | grep -v '^--$' || true
        fi
        echo
        echo -e "${GREEN}Main Web App:${NC}"
        if [ -f "$PROJECT_ROOT/apps/web/package.json" ]; then
            grep '"react"' "$PROJECT_ROOT/apps/web/package.json" || true
        fi
        echo
        echo -e "${YELLOW}Note:${NC} Dashboards use React 19, main app uses React 18.3.1"
        ;;
    6)
        echo -e "${GREEN}Opening Integration Guide...${NC}"
        if [ -f "$PROJECT_ROOT/docs/DASHBOARD_INTEGRATION.md" ]; then
            if command -v less &> /dev/null; then
                less "$PROJECT_ROOT/docs/DASHBOARD_INTEGRATION.md"
            elif command -v cat &> /dev/null; then
                cat "$PROJECT_ROOT/docs/DASHBOARD_INTEGRATION.md"
            else
                echo "Guide location: docs/DASHBOARD_INTEGRATION.md"
            fi
        else
            echo -e "${RED}Integration guide not found${NC}"
        fi
        ;;
    7)
        echo -e "${GREEN}Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac
