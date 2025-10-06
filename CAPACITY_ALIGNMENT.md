# HeliosHash DAO - Capacity Alignment & Verification

**Status**: CANONICAL REFERENCE  
**Last Updated**: October 6, 2025  
**Purpose**: Eliminate all capacity confusion across the codebase

## 🎯 DEFINITIVE SPECIFICATIONS

### Phase 1: Pilot System (Current)
- **Capacity**: **50 kW** (FINAL - no changes)
- **Daily Production**: 200-250 kWh (realistic for India)
- **Location**: Accessible site near development team
- **Budget**: ₹50 lakh (₹1 lakh per kW)
- **Timeline**: 2025-2026

### Phase 2: Urgam Valley (Future)
- **Capacity**: 100-200 kW (multi-site)
- **Location**: Urgam Valley, Uttarakhand
- **Timeline**: 2027+

## 🔍 DOCUMENT AUDIT RESULTS

### ✅ Already Correct:
- `PILOT.md`: ✅ Updated to 50 kW
- `constitution_reality_check.md`: ✅ Specifies 50kW 
- `examples/proposals/microgrid-urgam-001.json`: ✅ Updated to 50kW
- `docs/SOLAR_CAPACITY_SPECIFICATION.md`: ✅ Canonical reference

### ❌ Need Fixing:
- `HeliosHash-DAO/memory/constitution_reality_check.md`: Contains "5kW co-ownership MVP"
- Frontend files in `src/`: Multiple hardcoded 5kW references
- Test fixtures: Energy values don't match 50kW reality
- Various config files: Outdated capacity assumptions

## 🛠️ AUTOMATED FIX SCRIPT

### Usage:
```bash
# Check what needs fixing (safe)
./scripts/verify-capacity-alignment.sh --scan

# Apply fixes automatically
./scripts/verify-capacity-alignment.sh --fix

# Verify everything is aligned
./scripts/verify-capacity-alignment.sh --verify
```

## 📝 CONSTANTS DEFINITION

All code should reference these constants instead of magic numbers:

```typescript
// src/constants/system.ts
export const SYSTEM_SPECS = {
  // Phase 1 Pilot
  PILOT_CAPACITY_KW: 50,
  PILOT_EXPECTED_DAILY_KWH: 225,
  PILOT_PEAK_PRODUCTION_KW: 45,
  PILOT_CAPACITY_FACTOR: 0.19,
  PILOT_BUDGET_INR: 5000000,

  // Phase 2 Urgam Valley  
  URGAM_MIN_CAPACITY_KW: 100,
  URGAM_MAX_CAPACITY_KW: 200,
  
  // Revenue Tiers (for 50kW system)
  TIER1_GUARANTEED_KW: 30,
  TIER2_COMPUTING_KW: 15,
  TIER3_SPECULATIVE_KW: 5,
} as const;
```

## 🧪 TEST DATA STANDARDS

All test fixtures must use realistic values for 50kW system:

```csv
# data/microgrid/pilot_001_energy.csv
date,kwh_produced,kwh_consumed,kwh_exported,capacity_factor
2025-10-01,234.5,189.2,45.3,0.195  # Good day
2025-10-02,198.2,165.8,32.4,0.165  # Cloudy day  
2025-10-03,85.7,78.3,7.4,0.071     # Rainy day
```

**Valid Ranges for 50kW System:**
- Sunny day: 220-250 kWh
- Partly cloudy: 150-200 kWh  
- Rainy day: 50-100 kWh
- Monthly average: 5,500-6,500 kWh
- Never use values appropriate for 5kW system (20-25 kWh daily)

## 🚫 FORBIDDEN VALUES

**Never use these in any document or code:**
- `5 kW`, `5kW`, `5-kW` (too small for pilot)
- Daily production < 150 kWh (unrealistic for 50kW)
- Daily production > 280 kWh (impossible for 50kW)
- Budget < ₹40 lakh or > ₹60 lakh (out of range)

## ✅ VERIFICATION CHECKLIST

Before any commit/PR, verify:

- [ ] No hardcoded `5kW` references
- [ ] All energy test data in 150-280 kWh daily range
- [ ] Financial projections scaled to 50kW economics
- [ ] UI displays reflect 50kW capacity
- [ ] Proposal templates use 50kW spec
- [ ] Documentation is consistent

## 🔧 QUICK FIX COMMANDS

```bash
# Find all remaining 5kW references
grep -r "5 kW\|5kW\|5-kW" --exclude-dir=node_modules --exclude-dir=.git .

# Find unrealistic energy values  
grep -r "kwh.*: [0-9]" --include="*.json" --include="*.csv" . | \
  awk -F: '$2 < 150 || $2 > 280 { print $0 " ❌ UNREALISTIC" }'

# Update hardcoded values
find src/ -name "*.ts" -o -name "*.tsx" | \
  xargs sed -i 's/5kW/50kW/g; s/5 kW/50 kW/g'
```

## 🎯 ROOT CAUSE PREVENTION

### 1. Single Source of Truth
- This document (`CAPACITY_ALIGNMENT.md`) is the definitive reference
- All other documents must reference this, not duplicate specs

### 2. Constants Usage
- No magic numbers in code
- Import from `src/constants/system.ts`
- CI fails if hardcoded capacity values found

### 3. Test Validation
- All energy test data automatically validated against 50kW ranges
- PR template requires capacity consistency check

### 4. Documentation Standards
- Capacity specs only in this file and `SOLAR_CAPACITY_SPECIFICATION.md`
- All other docs reference these canonical sources

## 📊 MIGRATION STATUS

Track completion of capacity alignment:

- [x] Core documentation (PILOT.md, constitution_reality_check.md)
- [x] Proposal templates (examples/proposals/)
- [x] Canonical specification document
- [ ] Frontend components (src/components/)
- [ ] API routes and backend (src/app/api/)
- [ ] Test fixtures (data/, tests/)
- [ ] Configuration files
- [ ] README and getting started docs

## 🚀 NEXT ACTIONS

1. **Run verification script** to identify all misaligned references
2. **Update frontend components** to use 50kW constants  
3. **Fix test fixtures** with realistic 50kW energy data
4. **Update README** with correct capacity information
5. **Add CI validation** to prevent future misalignment

---

**This document establishes 50kW as the definitive pilot system capacity. Any conflicts between this and other documents should be resolved in favor of this specification.**