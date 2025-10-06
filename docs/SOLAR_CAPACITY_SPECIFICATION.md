# HeliosHash DAO - Solar Capacity Specification

**Status**: CANONICAL REFERENCE  
**Last Updated**: October 6, 2025  
**Supersedes**: All conflicting capacity references in other documents

## 🎯 Official Specifications

### Phase 1: Local Pilot (Current - 6 months)
- **Total Solar Capacity**: **50 kW**
- **Location**: Accessible location near development team (NOT Urgam Valley yet)
- **Purpose**: Validate revenue model, co-ownership platform, technical infrastructure

### Phase 2: Urgam Valley Deployment (2027+)
- **Estimated Capacity**: 100-200 kW (multi-site)
- **Location**: Urgam Valley, Uttarakhand
- **Purpose**: Full DAO governance, community energy system

## 📊 Load Breakdown (50kW Pilot)

### Guaranteed Services (Tier 1): ~30 kW
- Grid feed-in: 20 kW baseline
- Agricultural cold storage: 2 kW
- Irrigation pumps: 5 kW
- Community facilities: 3 kW

### Edge Computing (Tier 2): ~15 kW
- Micro data center: 10 kW
- AI services: 3 kW
- CDN cache: 2 kW

### Speculative Computing (Tier 3): ~5 kW
- Bitcoin mining (surplus only)
- Rendering farm
- Proof-of-useful-work projects

**Total Installed**: 50 kW  
**Typical Daily Production**: 200-250 kWh (assuming 4-5 sun hours)

## 🔧 Technical Configuration

### Solar Array
- **Panels**: ~125 × 400W monocrystalline panels
- **Inverters**: 3 × 15kW hybrid inverters with MPPT
- **Battery Storage**: 100 kWh (for night operations and emergency backup)
- **Monitoring**: Real-time SCADA with IoT sensors

### Grid Connection
- **Net Metering**: UERC-compliant bidirectional meter
- **Feed-in Rate**: ₹4-6/kWh (current Uttarakhand rates)
- **Export Capacity**: Up to 35 kW during peak production

## 💰 Financial Model (50kW @ ₹50 lakh investment)

### Revenue Projections
- **Grid Sales**: ₹3-4 lakh/year (Tier 1)
- **Agricultural Services**: ₹1.5-2 lakh/year (Tier 1)
- **Edge Computing**: ₹2-3 lakh/year (Tier 2)
- **Speculative**: ₹0.5-1 lakh/year (Tier 3)

**Total Annual**: ₹7-10 lakh  
**Payback Period**: 5-7 years  
**Community ROI Target**: 12-15% annually

## 📝 Document Corrections Required

### High Priority - Update Immediately:

1. **PILOT.md**:
   ```diff
   - Deploy HHDAO + Treasury canisters, onboard 5 real participants, and approve + fund the first 5 kW solar microgrid
   + Deploy HHDAO + Treasury canisters, onboard 5 real participants, and approve + fund the first 50 kW solar microgrid
   
   - capacityKW: 5
   + capacityKW: 50
   ```

2. **examples/proposals/microgrid-urgam-001.json** (create new file):
   ```json
   {
     "idempotencyKey": "microgrid-pilot-001",
     "title": "50kW Solar Microgrid - Phase 1 Pilot",
     "capacityKW": 50,
     "budget": {
       "capexINR": 5000000,
       "owpRewardAtomic": 500000000000
     }
   }
   ```

3. **REVENUE_IMPLEMENTATION_PLAN.md**:
   - Add section: "## Total System Capacity: 50kW"
   - Update all subsystem capacities to show they're portions of 50kW total

### Medium Priority - Update Next Sprint:

4. **constitution.md**: 
   - Add explicit capacity for pilot phase
   - Reference this document as canonical source

5. **README.md** (if exists):
   - Update project description with "50kW pilot" language

6. **All test data and mocks**:
   - Update energy production figures to match 50kW capacity
   - Daily production: 200-250 kWh range
   - Peak production: ~45 kW (accounting for inverter efficiency)

## 🧪 Updated Test Fixtures

### Energy Data Templates

**File**: `data/microgrid/pilot_001_energy.csv`
```csv
date,kwh_produced,kwh_consumed,kwh_exported
2025-10-03,234.5,189.2,45.3
2025-10-04,241.8,195.7,46.1
2025-10-05,228.4,183.5,44.9
```

**Realistic ranges for 50kW system**:
- Sunny day: 220-250 kWh
- Partly cloudy: 150-200 kWh
- Rainy day: 50-100 kWh
- Monthly average: 5,500-6,500 kWh

## ⚠️ Common Errors to Avoid

### ❌ DO NOT use these values anywhere:
- "5 kW solar system" (too small)
- "5000 kW" or "5 MW" (too large)
- "500 kW" (wrong order of magnitude)

### ✅ ALWAYS use:
- "50 kW solar system" or "50kW microgrid"
- Energy in kWh (not kW for production data)
- Capacity factor: 15-20% (realistic for India)

## 🔄 Migration Checklist

- [ ] Update PILOT.md with 50kW specifications
- [ ] Create/update proposal template JSON files
- [ ] Update all test fixtures and mock data
- [ ] Update frontend UI labels and copy
- [ ] Update canister test expectations
- [ ] Search codebase for "5kW", "5 kW", "5-kW" and replace
- [ ] Update all architecture diagrams
- [ ] Verify financial models scale correctly
- [ ] Update energy monitoring thresholds in code

## 📞 Verification Commands

```bash
# Search for any remaining 5kW references
grep -r "5 kW\|5kW\|5-kW" --exclude-dir=node_modules --exclude-dir=.git .

# Search for capacity-related variables
grep -r "capacityKW\|capacity_kw\|CAPACITY_KW" src/ canisters/

# Verify test data is realistic for 50kW
grep -r "kwh\|kWh\|KWH" tests/ data/
```

## 🎯 Why 50kW is Correct

1. **Revenue viability**: 5kW generates ~₹1.5 lakh/year (insufficient)
2. **Service load**: Edge computing alone needs 10kW
3. **Community impact**: 50kW serves 25-30 households meaningfully
4. **Investment scale**: ₹50 lakh investment is realistic for pilot
5. **Matches constitution_reality_check.md Phase 2 spec**: "Deploy actual 50kW solar system"

## 📚 References

- Constitution Reality Check v3.0: Phase 2 specification
- UERC Net Metering Policy (Uttarakhand): Small-scale ≤ 500kW
- Solar Economics India 2024: ₹1 lakh/kW installed cost
- Community Energy Best Practices: 50-100kW optimal for village pilots

---

**This document is the single source of truth for all capacity specifications. Any conflict between this and other documents should be resolved in favor of this specification.**

**Next Review**: Before Phase 2 deployment to Urgam Valley (2027)