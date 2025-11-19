# Urgam Valley Microgrid Pilot Loop (Phase C Kickoff)

> "From code to kilowatts." This pilot validates the full HHDAO loop: community governance → proposal → funded solar → tracked impact → shared rewards.

## 🎯 Pilot Objective

Deploy HHDAO + Treasury canisters, onboard 5 real participants, and approve + fund the first 5 kW solar microgrid for Urgam Valley, tracking social + energy metrics and distributing OWP.

## 👥 Roles (5 Anchor Participants)

| Role                  | Purpose                       | Expected Actions                             |
| --------------------- | ----------------------------- | -------------------------------------------- |
| Solar Installer       | Implements system             | Submits installation milestone + energy data |
| Gram Panchayat Rep    | Local governance legitimacy   | Votes, verifies site suitability             |
| Local Investor        | Seed capital & accountability | Votes, monitors ROI narrative                |
| Community Steward (1) | Social signal & feedback      | Votes, submits localized reports             |
| Community Steward (2) | Redundancy + consistency      | Votes, validates impact claims               |

## 🔁 Pilot Loop Steps

1. Deploy canisters (dao, treasury, identity, telemetry placeholder).
2. Register treasury authorization (DAO + Identity) post-deploy.
3. Create Proposal: `Microgrid #1 – Urgam Valley (5 kW)`.
4. Participants authenticate (placeholder simple principal mapping) and vote.
5. Auto-finalization triggers mint of OWP reward tranche to installer wallet.
6. Energy output (mock or manual entry) is ingested (telemetry stub or CSV import).
7. Dashboard reflects: cumulative kWh, OWP distributed, participant votes, social notes.
8. Repeat monthly: performance review + possible bonus proposal.

## 🧪 Success Metrics (Day 30)

- ≥ 5 unique principals cast at least 1 vote.
- Proposal passes and finalizes within configured voting window.
- OWP minted only once and matches approved amount.
- Energy dataset ingested: ≥ 7 daily entries (kWh) for week 1.
- Public dashboard shares: total kWh, OWP minted, participant count.
- Qualitative: at least 2 steward feedback notes.

## 📊 Initial Funding Proposal Template

See `examples/proposals/microgrid-urgam-001.json` (to be created).

Key Fields:

- idempotencyKey
- title
- description (local language snippet optional)
- capacityKW: 5
- location: { village, district, state, lat, lon }
- budget: { capexINR, owpRewardAtomic }
- milestones: [ { name, expectedDate, rewardPortionBps } ]
- impact: { households, jobsSupported }

## 🔐 Governance & Controls

| Control                | Mechanism                                                 |
| ---------------------- | --------------------------------------------------------- |
| Mint Authorization     | Treasury `mint` restricted to DAO principal               |
| Single Reward Issuance | Track proposal status → only mint on #Passed transition   |
| Identity Balance Sync  | DAO triggers `syncIdentityBalance` (future cron / manual) |
| Test Mode Isolation    | Use local network first (`dfx start`) before IC push      |

## 🚀 Deployment Flow

```bash
# Local
./scripts/deploy-pilot.sh --network local

# To IC (after review)
./scripts/deploy-pilot.sh --network ic
```

The script will:

1. `dfx deploy` all core canisters.
2. Capture principals → write `.pilot/addresses.json`.
3. Call `setDaoCanister` + `setIdentityCanister` on treasury.
4. (Future) Register treasury with identity if required.

## 🗳 Proposal Creation

```bash
./scripts/create-proposal.sh examples/proposals/microgrid-urgam-001.json
```

Outputs new proposal ID and waits for finalization (poll or manual CLI vote loop).

## 🧾 Energy Data

Place CSV under `data/microgrid/urgam_001_energy.csv`:

```
# date,kwh
2025-10-03,18.4
2025-10-04,19.1
2025-10-05,17.6
```

Future: telemetry canister ingestion endpoint.

## 🗣 Voice Notes (Placeholder)

`voice/README.md` will define pipeline: capture (mobile) → local Whisper / API → text summary → optional translation → proposal draft augmentation.

## 🧱 Roadmap After Pilot

1. Persistent ledger upgrade path (stable memory indexing)
2. Subaccount support (ICRC-1 completeness)
3. Energy-to-reward dynamic formulas
4. On-chain reputation curves for voters
5. Multi-language intent AI assistant

## 🛑 Exit Criteria for Pilot Completion

- All success metrics met.
- Post-mortem document filed: lessons, friction points, social reactions.
- Decision: scale to 3 additional villages OR iterate on governance primitives first.

---

_This document will evolve as real-world constraints surface. Treat it as a living operational spec._
