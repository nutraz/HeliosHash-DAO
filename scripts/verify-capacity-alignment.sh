#!/usr/bin/env bash
# HeliosHash DAO Capacity Alignment Verification & Fix Script
# Eliminates all 5kW references and ensures 50kW consistency

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

MODE="scan"
if [[ "$1" == "--fix" ]]; then
    MODE="fix"
elif [[ "$1" == "--verify" ]]; then
    MODE="verify"
elif [[ "$1" == "--scan" ]]; then
    MODE="scan"
else
    echo "Usage: $0 [--scan|--fix|--verify]"
    echo "  --scan   : Show what needs fixing (default)"
    echo "  --fix    : Apply fixes automatically"  
    echo "  --verify : Verify everything is aligned"
    exit 1
fi

echo -e "${BLUE}=================================================="
echo "🔧 HeliosHash DAO Capacity Alignment Tool"
echo "=================================================="
echo -e "Mode: ${YELLOW}$MODE${NC}"
echo ""

# Initialize counters
total_issues=0
files_fixed=0

# Function to log issues
log_issue() {
    local file="$1"
    local line="$2" 
    local issue="$3"
    echo -e "   ${RED}❌${NC} $file:$line - $issue"
    ((total_issues++))
}

# Function to log fixes
log_fix() {
    local file="$1"
    local action="$2"
    echo -e "   ${GREEN}✓${NC} $file - $action"
    ((files_fixed++))
}

# Check for 5kW references
check_5kw_references() {
    echo -e "${YELLOW}🔍 Checking for 5kW references...${NC}"
    
    local found_5kw=false
    
    # Find 5kW references (excluding this script and backups)
    while IFS= read -r line; do
        if [[ -n "$line" ]]; then
            found_5kw=true
            local file=$(echo "$line" | cut -d: -f1)
            local linenum=$(echo "$line" | cut -d: -f2)
            local content=$(echo "$line" | cut -d: -f3-)
            
            log_issue "$file" "$linenum" "Contains '5kW' reference: $content"
            
            if [[ "$MODE" == "fix" ]]; then
                # Apply fixes
                if [[ "$file" == *.md || "$file" == *.json || "$file" == *.ts || "$file" == *.tsx ]]; then
                    sed -i 's/5 kW/50 kW/g; s/5kW/50kW/g; s/5-kW/50-kW/g' "$file" 2>/dev/null || true
                    log_fix "$file" "Updated 5kW → 50kW"
                fi
            fi
        fi
    done < <(grep -rn "5 kW\|5kW\|5-kW" \
        --exclude-dir=node_modules \
        --exclude-dir=.git \
        --exclude-dir=".backup-*" \
        --exclude="verify-capacity-alignment.sh" \
        --exclude="fix-capacity-references.sh" \
        --exclude="*.log" \
        . 2>/dev/null | head -20)
    
    if [[ "$found_5kw" == false ]]; then
        echo -e "   ${GREEN}✓${NC} No 5kW references found"
    fi
}

# Check test data ranges
check_test_data() {
    echo -e "${YELLOW}🧪 Checking test data for realistic 50kW values...${NC}"
    
    # Check CSV files for unrealistic energy values
    if [[ -d "data" ]]; then
        find data/ -name "*.csv" -type f | while read -r file; do
            if grep -q "kwh_produced" "$file" 2>/dev/null; then
                # Check for values outside 50-280 kWh range
                while IFS=, read -r date kwh_produced rest; do
                    if [[ "$kwh_produced" =~ ^[0-9]+\.?[0-9]*$ ]]; then
                        if (( $(echo "$kwh_produced < 50" | bc -l) )); then
                            log_issue "$file" "$date" "Daily production $kwh_produced kWh too low for 50kW system"
                        elif (( $(echo "$kwh_produced > 280" | bc -l) )); then
                            log_issue "$file" "$date" "Daily production $kwh_produced kWh too high for 50kW system"
                        fi
                    fi
                done < <(tail -n +2 "$file")
            fi
        done
    fi
    
    # Check JSON files for capacity values
    find . -name "*.json" -not -path "./node_modules/*" -not -path "./.git/*" | while read -r file; do
        if grep -q "capacityKW.*: 5[^0-9]" "$file" 2>/dev/null; then
            log_issue "$file" "-" "Contains capacityKW: 5 (should be 50)"
            
            if [[ "$MODE" == "fix" ]]; then
                sed -i 's/"capacityKW": 5/"capacityKW": 50/g; s/"capacity_kw": 5/"capacity_kw": 50/g' "$file"
                log_fix "$file" "Updated capacityKW: 5 → 50"
            fi
        fi
    done
}

# Check frontend components
check_frontend_components() {
    echo -e "${YELLOW}⚛️  Checking frontend components...${NC}"
    
    # Check for hardcoded values in React components
    find src/ -name "*.ts" -o -name "*.tsx" | while read -r file; do
        if grep -q "5.*kW\|5000.*W" "$file" 2>/dev/null; then
            local line_num=$(grep -n "5.*kW\|5000.*W" "$file" | head -1 | cut -d: -f1)
            local content=$(grep -n "5.*kW\|5000.*W" "$file" | head -1 | cut -d: -f2-)
            log_issue "$file" "$line_num" "Hardcoded capacity: $content"
            
            if [[ "$MODE" == "fix" ]]; then
                # Apply common substitutions
                sed -i 's/5kW/50kW/g; s/5 kW/50 kW/g; s/5000W/50000W/g' "$file"
                log_fix "$file" "Updated hardcoded capacity values"
            fi
        fi
    done
}

# Create system constants file
create_constants_file() {
    if [[ "$MODE" == "fix" ]]; then
        echo -e "${YELLOW}📝 Creating system constants...${NC}"
        
        mkdir -p src/constants
        cat > src/constants/system.ts << 'EOF'
/**
 * HeliosHash DAO System Constants
 * Single source of truth for all capacity and energy specifications
 * 
 * IMPORTANT: Always import these constants instead of using magic numbers
 */

export const SYSTEM_SPECS = {
  // Phase 1 Pilot System
  PILOT_CAPACITY_KW: 50,
  PILOT_EXPECTED_DAILY_KWH: 225,
  PILOT_PEAK_PRODUCTION_KW: 45,
  PILOT_CAPACITY_FACTOR: 0.19,
  PILOT_BUDGET_INR: 5000000,

  // Phase 2 Urgam Valley
  URGAM_MIN_CAPACITY_KW: 100,
  URGAM_MAX_CAPACITY_KW: 200,
  
  // Load Distribution (for 50kW pilot)
  TIER1_GUARANTEED_KW: 30,    // Grid feed-in, agriculture
  TIER2_COMPUTING_KW: 15,     // Edge computing, AI services
  TIER3_SPECULATIVE_KW: 5,    // Bitcoin mining, rendering
  
  // Production Ranges (50kW system)
  MIN_DAILY_PRODUCTION_KWH: 50,   // Worst weather
  MAX_DAILY_PRODUCTION_KWH: 280,  // Peak conditions
  AVERAGE_DAILY_PRODUCTION_KWH: 225,
  
  // Financial
  COST_PER_KW_INR: 100000,        // ₹1 lakh per kW
  EXPECTED_ANNUAL_ROI: 0.14,       // 14%
  PAYBACK_PERIOD_YEARS: 6.5,
} as const;

export type SystemSpecs = typeof SYSTEM_SPECS;

// Validation functions
export const validateDailyProduction = (kWh: number): boolean => {
  return kWh >= SYSTEM_SPECS.MIN_DAILY_PRODUCTION_KWH && 
         kWh <= SYSTEM_SPECS.MAX_DAILY_PRODUCTION_KWH;
};

export const validateCapacity = (kW: number): boolean => {
  return kW === SYSTEM_SPECS.PILOT_CAPACITY_KW || 
         (kW >= SYSTEM_SPECS.URGAM_MIN_CAPACITY_KW && kW <= SYSTEM_SPECS.URGAM_MAX_CAPACITY_KW);
};
EOF
        log_fix "src/constants/system.ts" "Created system constants file"
    fi
}

# Update test fixtures
update_test_fixtures() {
    if [[ "$MODE" == "fix" ]]; then
        echo -e "${YELLOW}📊 Updating test fixtures...${NC}"
        
        mkdir -p data/microgrid
        
        # Create realistic energy data
        cat > data/microgrid/pilot_001_energy.csv << 'EOF'
date,kwh_produced,kwh_consumed,kwh_exported,capacity_factor
2025-10-01,234.5,189.2,45.3,0.195
2025-10-02,241.8,195.7,46.1,0.201
2025-10-03,228.4,183.5,44.9,0.190
2025-10-04,215.7,178.3,37.4,0.180
2025-10-05,198.2,165.8,32.4,0.165
2025-10-06,242.3,197.2,45.1,0.202
2025-10-07,238.9,193.5,45.4,0.199
EOF
        log_fix "data/microgrid/pilot_001_energy.csv" "Created realistic 50kW production data"
        
        # Update monthly summary
        cat > data/microgrid/monthly_summary.json << 'EOF'
{
  "month": "2025-10",
  "capacityKW": 50,
  "totalProductionKWh": 6850,
  "averageDailyKWh": 228,
  "capacityFactor": 0.19,
  "revenueINR": 45600,
  "breakdown": {
    "tier1_grid": 28400,
    "tier1_agricultural": 8200,
    "tier2_computing": 7000,
    "tier3_speculative": 2000
  }
}
EOF
        log_fix "data/microgrid/monthly_summary.json" "Updated monthly summary for 50kW"
    fi
}

# Main execution
echo "Starting capacity alignment check..."
echo ""

check_5kw_references
echo ""
check_test_data  
echo ""
check_frontend_components
echo ""

if [[ "$MODE" == "fix" ]]; then
    create_constants_file
    echo ""
    update_test_fixtures
    echo ""
fi

# Final summary
echo -e "${BLUE}=================================================="
echo "📊 SUMMARY"
echo "=================================================="

if [[ "$MODE" == "scan" ]]; then
    if [[ $total_issues -eq 0 ]]; then
        echo -e "${GREEN}✅ No capacity alignment issues found!${NC}"
    else
        echo -e "${RED}❌ Found $total_issues capacity alignment issues${NC}"
        echo ""
        echo "Run with --fix to automatically resolve these issues:"
        echo "  $0 --fix"
    fi
elif [[ "$MODE" == "fix" ]]; then
    echo -e "${GREEN}✅ Applied fixes to $files_fixed files${NC}"
    echo -e "${YELLOW}📝 Created/updated system constants and test fixtures${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review changes: git diff"
    echo "2. Run verification: $0 --verify"
    echo "3. Update any remaining manual references"
    echo "4. Commit: git add -A && git commit -m 'fix: align all capacity references to 50kW'"
elif [[ "$MODE" == "verify" ]]; then
    if [[ $total_issues -eq 0 ]]; then
        echo -e "${GREEN}✅ All capacity references are properly aligned to 50kW!${NC}"
    else
        echo -e "${RED}❌ Still found $total_issues alignment issues${NC}"
        echo "Run with --fix to resolve remaining issues"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}📚 Reference: See CAPACITY_ALIGNMENT.md for complete specifications${NC}"
echo "=================================================="