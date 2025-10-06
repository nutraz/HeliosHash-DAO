#!/usr/bin/env bash
# Fix all 5kW references to 50kW across the repository
# Usage: ./scripts/fix-capacity-references.sh [--dry-run]

set -e

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "🔍 DRY RUN MODE - No files will be modified"
fi

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=================================================="
echo "🔧 HeliosHash DAO Capacity Reference Fixer"
echo "=================================================="
echo ""

# Create backup
BACKUP_DIR=".backup-capacity-fix-$(date +%Y%m%d-%H%M%S)"
if [ "$DRY_RUN" = false ]; then
    echo "📦 Creating backup at $BACKUP_DIR..."
    mkdir -p "$BACKUP_DIR"
fi

# Files to fix
declare -a FILES=(
    "PILOT.md"
    "examples/proposals/microgrid-urgam-001.json"
    "templates/REVENUE_IMPLEMENTATION_PLAN.md"
    "README.md"
)

# Patterns to search and replace
declare -A PATTERNS=(
    ["5 kW"]="50 kW"
    ["5kW"]="50kW"
    ["5-kW"]="50-kW"
    ["capacityKW: 5"]="capacityKW: 50"
    ["capacity_kw\": 5"]="capacity_kw\": 50"
)

# Function to fix a file
fix_file() {
    local file="$1"
    local changes=0
    
    if [[ ! -f "$file" ]]; then
        echo -e "${YELLOW}⚠️  File not found: $file${NC}"
        return
    fi
    
    # Backup original
    if [ "$DRY_RUN" = false ]; then
        cp "$file" "$BACKUP_DIR/$(basename $file).bak"
    fi
    
    echo ""
    echo -e "${GREEN}📝 Processing: $file${NC}"
    
    # Apply each pattern
    for pattern in "${!PATTERNS[@]}"; do
        replacement="${PATTERNS[$pattern]}"
        
        # Count occurrences
        count=$(grep -o "$pattern" "$file" 2>/dev/null | wc -l || echo 0)
        
        if [[ $count -gt 0 ]]; then
            echo -e "   ${YELLOW}Found $count occurrence(s) of '$pattern'${NC}"
            
            if [ "$DRY_RUN" = false ]; then
                # Perform replacement (macOS compatible)
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' "s/$pattern/$replacement/g" "$file"
                else
                    sed -i "s/$pattern/$replacement/g" "$file"
                fi
                echo -e "   ${GREEN}✓ Replaced with '$replacement'${NC}"
                ((changes++))
            else
                echo -e "   ${YELLOW}Would replace with '$replacement'${NC}"
            fi
        fi
    done
    
    if [[ $changes -eq 0 ]] && [ "$DRY_RUN" = false ]; then
        echo -e "   ${GREEN}✓ No changes needed${NC}"
    fi
}

# Function to create example proposal if missing
create_example_proposal() {
    local file="examples/proposals/microgrid-urgam-001.json"
    
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}✓ Proposal file exists, fixing capacity...${NC}"
        fix_file "$file"
        return
    fi
    
    echo ""
    echo -e "${YELLOW}📄 Creating missing proposal template: $file${NC}"
    
    if [ "$DRY_RUN" = false ]; then
        mkdir -p "examples/proposals"
        
        cat > "$file" << 'EOF'
{
  "idempotencyKey": "microgrid-pilot-001",
  "title": "50kW Solar Microgrid - Phase 1 Pilot",
  "description": "First operational solar microgrid to validate HeliosHash DAO platform with real energy production, co-ownership, and revenue distribution.",
  "capacityKW": 50,
  "location": {
    "village": "TBD",
    "district": "TBD",
    "state": "Uttarakhand",
    "coordinates": {
      "lat": null,
      "lon": null
    }
  },
  "budget": {
    "capexINR": 5000000,
    "owpRewardAtomic": 500000000000,
    "currency": "INR"
  },
  "milestones": [
    {
      "name": "Site preparation and foundation",
      "expectedDate": "2025-11-30",
      "rewardPortionBps": 1000
    },
    {
      "name": "Solar panel and inverter installation",
      "expectedDate": "2025-12-31",
      "rewardPortionBps": 3000
    },
    {
      "name": "Grid connection and commissioning",
      "expectedDate": "2026-01-31",
      "rewardPortionBps": 3000
    },
    {
      "name": "30-day operational validation",
      "expectedDate": "2026-03-01",
      "rewardPortionBps": 3000
    }
  ],
  "impact": {
    "householdsServed": 30,
    "jobsSupported": 8,
    "annualCO2OffsetKg": 45000,
    "expectedAnnualProductionKWh": 73000
  },
  "technicalSpecs": {
    "panelCount": 125,
    "panelWattage": 400,
    "inverterCount": 3,
    "inverterCapacityKW": 15,
    "batteryCapacityKWh": 100
  }
}
EOF
        echo -e "${GREEN}✓ Created with 50kW specification${NC}"
    else
        echo -e "${YELLOW}Would create file with 50kW specification${NC}"
    fi
}

# Function to update test fixtures
update_test_fixtures() {
    local test_data_dir="data/microgrid"
    
    echo ""
    echo -e "${GREEN}📊 Updating test data fixtures...${NC}"
    
    if [ "$DRY_RUN" = false ]; then
        mkdir -p "$test_data_dir"
        
        # Create realistic 50kW energy data
        cat > "$test_data_dir/pilot_001_energy.csv" << 'EOF'
date,kwh_produced,kwh_consumed,kwh_exported,capacity_factor
2025-10-03,234.5,189.2,45.3,0.195
2025-10-04,241.8,195.7,46.1,0.201
2025-10-05,228.4,183.5,44.9,0.190
2025-10-06,215.7,178.3,37.4,0.180
2025-10-07,198.2,165.8,32.4,0.165
2025-10-08,242.3,197.2,45.1,0.202
2025-10-09,238.9,193.5,45.4,0.199
EOF
        echo -e "   ${GREEN}✓ Created realistic 50kW production data${NC}"
        
        # Create monthly summary template
        cat > "$test_data_dir/monthly_summary_template.json" << 'EOF'
{
  "month": "2025-10",
  "capacityKW": 50,
  "totalProductionKWh": 6850,
  "averageDailyKWh": 228,
  "capacityFactor": 0.19,
  "gridExportKWh": 1280,
  "revenueINR": 45600,
  "breakdown": {
    "tier1_grid": 28400,
    "tier1_agricultural": 8200,
    "tier2_computing": 7000,
    "tier3_speculative": 2000
  }
}
EOF
        echo -e "   ${GREEN}✓ Created monthly summary template${NC}"
    else
        echo -e "   ${YELLOW}Would create test fixtures with 50kW capacity${NC}"
    fi
}

# Main execution
echo ""
echo "🔍 Scanning repository for capacity references..."
echo ""

# Fix each file
for file in "${FILES[@]}"; do
    fix_file "$file"
done

# Create/fix proposal
create_example_proposal

# Update test fixtures
update_test_fixtures

# Search for any remaining issues
echo ""
echo "🔍 Searching for remaining incorrect references..."
echo ""

# Find any remaining 5kW references (excluding this script and node_modules)
remaining=$(grep -r "5 kW\|5kW\|5-kW" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir="$BACKUP_DIR" \
    --exclude="fix-capacity-references.sh" \
    --exclude="*.log" \
    . 2>/dev/null | grep -v "Binary file" || true)

if [[ -n "$remaining" ]]; then
    echo -e "${RED}⚠️  Additional 5kW references found:${NC}"
    echo "$remaining"
    echo ""
    echo -e "${YELLOW}Please review these manually.${NC}"
else
    echo -e "${GREEN}✓ No additional 5kW references found${NC}"
fi

# Summary
echo ""
echo "=================================================="
echo "✅ SUMMARY"
echo "=================================================="

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}DRY RUN - No files were modified${NC}"
    echo ""
    echo "Run without --dry-run to apply changes:"
    echo "  ./scripts/fix-capacity-references.sh"
else
    echo -e "${GREEN}Capacity references updated successfully!${NC}"
    echo ""
    echo "Backup created at: $BACKUP_DIR"
    echo ""
    echo "Next steps:"
    echo "1. Review changes: git diff"
    echo "2. Run tests: pnpm test:all"
    echo "3. Commit changes: git commit -am 'fix: update capacity specs from 5kW to 50kW'"
    echo "4. Update capacity specification document as canonical reference"
fi

echo ""
echo "📚 Reference: See CAPACITY_SPEC.md for complete technical details"
echo "=="================================================