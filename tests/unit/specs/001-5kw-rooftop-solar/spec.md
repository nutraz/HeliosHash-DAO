# Feature Specification: 50kW Rooftop Solar Co-Ownership MVP

**Status**: Reality Check
**Timeline**: 30 days
**Budget**: ₹3L max (including my own investment)

## User Scenarios & Testing

### Primary User Story

Three neighbors (me + 2 friends/family) want to split the cost of installing solar on one of our roofs. We need transparent tracking of:

- Who paid what (ownership %)
- How much energy is being generated
- Monthly savings/revenue split

### Acceptance Scenarios

1. **Given** I am one of 3 investors, **When** I invest ₹1L out of ₹3L total, **Then** I own exactly 33.33% of the system
2. **Given** system generates 20 kWh today, **When** I check my dashboard, **Then** I see my 33.33% share = 6.67 kWh credited
3. **Given** we have ₹5000 revenue this month, **When** distribution runs, **Then** each 33.33% owner receives ₹1666.67

### Edge Cases

- What if one owner wants to sell their share?
- What if inverter breaks - who pays for repair?
- What if energy production is lower than expected?

## Requirements

### Functional Requirements

- **FR-001**: System MUST track exact investment amount per co-owner
- **FR-002**: System MUST calculate ownership % = (individual investment / total investment) × 100
- **FR-003**: System MUST display real-time energy generation from IoT sensor
- **FR-004**: System MUST distribute revenue proportionally based on ownership %
- **FR-005**: System MUST show historical energy production and earnings

### Key Entities

- **Investment**: investor_id, amount, timestamp, ownership_percentage
- **EnergyReading**: timestamp, kwh_generated, system_id
- **Distribution**: month, total_revenue, per_owner_payout

## Success Criteria

- [ ] 3 real people invested real money (even if just ₹1000 each for prototype)
- [ ] System correctly calculates ownership %
- [ ] Dashboard shows live or simulated energy data
- [ ] Revenue distribution formula verified by all 3 owners

## What This DOESN'T Include

- ❌ Urgam Valley deployment
- ❌ Job boards
- ❌ NFT collections
- ❌ Voice interfaces
- ❌ Government integrations
- ❌ 1WP ecosystem syncing

## Reality Check Commitments

### This Week

- [ ] Day 1: Create this spec (DONE)
- [ ] Day 2: Build minimal investment tracking page
- [ ] Day 3: Find 2 real people to pilot test
- [ ] Day 4: Demo prototype to those 2 people
- [ ] Day 5: Commit to 30-day pilot OR kill project

### 30-Day Success Metrics

1. ✅ **3 people invested real money** (minimum ₹1000 each)
2. ✅ **Platform correctly calculates ownership %**
3. ✅ **Dashboard shows energy data** (real or simulated)
4. ✅ **All 3 people can log in and see their share**
5. ✅ **Written testimonial from at least 1 co-owner**

### Kill Criteria (if NOT achieved by Day 30)

- ❌ Can't find 2 people willing to test = **idea validation failed**
- ❌ Math doesn't work or disputes arise = **product not ready**
- ❌ Platform too complex to use = **wrong approach**

**If any kill criteria triggered → pivot or shut down**
