# HeliosHash DAO — AI Copilot Agent Instructions

## 🎯 PROJECT VISION & STRATEGY

**HeliosHash DAO (HHDAO)** is India's implementation of the **One World Project (1WP)**, building a scalable model for decentralized solar infrastructure and community governance.

### Two-Phase National Rollout Strategy:

#### Phase 1: Baghpat Pilot (Micro-Scale Proof of Concept)
- **Location**: Baghpat, Uttar Pradesh (early supporter advantage)
- **Scope**: 5kW solar project (scalable to 50kW) - ₹60,00,000 INR starting budget
- **Objective**: Prove technology, governance, and community engagement models
- **Outcome**: Create replicable blueprint and secure approvals for Phase 2

#### Phase 2: Urgam Valley Special Economic Zone (Macro-Scale National Model)
- **Location**: Urgam Valley, Chamoli, Uttarakhand (12-village ecosystem)
- **Vision**: Self-sustained ecological energy zone dedicated to Kalpeshwar Mahadev
- **Scale**: 3MW capacity with 10km hi-tech infrastructure from Helang to Kalpeshwar Mahadev
- **Funding**: Global NFT participation with revenue returns - SEPARATE from KYC ID system

**CRITICAL CLARIFICATION**: 
- Baghpat serves as DEMONSTRATION PROJECT only 
- Urgam Valley funded via GLOBAL NFT PARTICIPATION with revenue sharing
- KYC ID NFTs (for Indian users) and Investment NFTs (global participants) are SEPARATE systems

---

## ⚠️ CRITICAL PROJECT CONTEXT

### Development Status: EARLY ALPHA (October 2025)
- **🔴 NOT PRODUCTION READY** — Testnet/local development ONLY
- **⚠️ UNAUDITED SMART CONTRACTS** — 9 Motoko canisters require professional audit
- **💰 ~$100k-160k funding required** before production deployment
- **⏱️ 8-12 months estimated timeline** to production readiness
- **🚫 NO REAL FUNDS** — All features for testing/feedback only

### Production Readiness Score: 3.9/10
See [Full Assessment](docs/production-readiness-2025-10-20.md) for detailed gap analysis.

---

## 👤 PROJECT LEADERSHIP

### Primary Contact: **Nutrazz** (Project Ambassador)
- **Role**: One World Project Ambassador & HeliosHash Development Lead
- **Focus**: Mobile app development, community engagement, and UrgamU initiative
- **Contact**: Primary decision-maker for technical and strategic direction

---

## 🏗️ ARCHITECTURE OVERVIEW

| Layer | Technology | Location | Critical Notes |
|-------|-----------|----------|----------------|
| **Frontend** | Next.js 15.5.4 (App Router) | `src/app/` | Use `'use client'` for interactivity |
| **UI Components** | shadcn/ui + Tailwind CSS | `src/components/ui/` | Saffron `#FF9933`, Green `#138808`, Navy `#0A1A2F` |
| **Backend** | Motoko canisters (IC) | `canisters/` | **UNAUDITED ⚠️** — 9+ canisters |
| **Token System** | HHU/HHX Token | `canisters/token/` | **DECISION PENDING** |
| **NFT Systems** | Dual NFT Architecture | `canisters/nft/` | SEPARATE: KYC ID vs Investment NFTs |
| **Bridge** | Solidity ↔ Motoko | `contracts/Bridge.sol` ↔ `canisters/bridge/` | CBOR/JSON payloads |
| **Auth** | Mocked (MVP) | `src/hooks/useAuthContext` | Test accounts only |
| **Mobile** | Responsive web + QR server | `mobile_hhdao_server.js` | LAN testing only |

### Tech Stack Version Lock
- **Next.js**: 15.5.4
- **React**: 19.0.0
- **TypeScript**: 5.7.3
- **Tailwind CSS**: 3.4.17
- **DFX**: 0.29.1
- **Node.js**: 18+ (pnpm 10.15.1)

---

## 💰 FUNDING ARCHITECTURE: DUAL NFT SYSTEM

### System 1: KYC ID NFTs (Indian Users Only)
```motoko
// For Indian citizen onboarding
- Aadhaar/PAN/retina verification required
- INR payments only
- Identity and access management
- NO revenue sharing - pure utility NFTs
```

### System 2: Investment NFTs (Global Participation)
```motoko
// For Urgam Valley funding worldwide
- Open global participation
- Crypto payments accepted
- Revenue sharing mechanisms
- Returns from UrgamU operations:
  * Micro data centers (8-12% projected returns)
  * Energy token ecosystem
  * Bitcoin mining revenue
  * Cloud services income
```

### Revenue Streams for Investment NFTs:
- **40%**: Cloud services from micro data centers
- **30%**: Blockchain infrastructure services
- **20%**: AI/ML computing capacity
- **10%**: Heat recapture monetization

---

## 🪙 TOKEN ECONOMICS: HHU/HHX DECISION PENDING

### Token Options Under Consideration:
- **HHU** (HeliosHash UrgamU) - Preferred, emphasizes UrgamU vision
- **HHX** (HeliosHash) - Alternative, broader branding

### Core Token Mechanics:
- **Distribution**: Participation rewards across both phases
- **Utility**: Unified governance + economic ecosystem access
- **Scope**: Single token system for micro → macro scaling

---

## 📱 NUTRAZZ'S MOBILE APP STRATEGY

### Core App Features (Under Nutrazz's Development):
```typescript
// User Onboarding Flow:
1. Mobile-first responsive design
2. KYC Integration: Aadhaar, PAN, retina, mobile seed phrase
3. Dual NFT Minting: 
   - KYC ID NFTs (INR payments, Indian users)
   - Investment NFTs (crypto, global users)
4. Profile System: PFP + 2 confidants for recovery
5. DAO Participation: INR or crypto voting
6. Project Management: Start/join community projects
7. Asset Tracking: Document/photo/asset bins
8. Energy Metrics: Real-time solar production
9. Gamification: Participation rewards
```

### Development Priority Stack:
1. ✅ **P1**: Baghpat pilot app features (current focus)
2. 🟡 **P2**: Global NFT investment platform
3. 🔵 **P3**: UrgamU Smart City integration
4. ⚫ **P4**: Advanced Web3 features

---

## 🗳️ GOVERNANCE ROADMAP & SCALING PATH

### Current State: Token-Based Voting (Baghpat Pilot)
- **Mechanism**: Direct token-weighted voting for pilot proposals
- **Scope**: Community grants and operational decisions in Baghpat

### Planned Evolution for National Scale:

#### Phase 1: Quadratic Voting (Baghpat Refinement)
- **Timeline**: Q1 2026
- **Scope**: Small proposals under $5,000 in Baghpat pilot

#### Phase 2: Conviction Voting (Urgam Valley SEZ)
- **Timeline**: Q2 2026
- **Scope**: Long-term initiatives in 12-village ecosystem

#### Phase 3: Delegated Governance (National Replication)
- **Timeline**: Q3 2026+
- **Structure**: "Citizen's House" + "Expert Council" for SEZ management

---

## 🔄 DEVELOPMENT PRIORITIES BY PHASE

### Phase 1 (Baghpat Pilot) Focus - NUTRAZZ'S IMMEDIATE TASKS:
```typescript
// Priority: Mobile App MVP for Baghpat
- KYC integration flows (Aadhaar/PAN/retina)
- INR payment gateway for ID NFT minting
- Basic DAO governance interface
- User profile with confidant system
- Asset/document management bins
- Energy metrics display for 5kW system
```

### Phase 2 (Urgam Valley) Preparation:
```typescript
// Priority: Global NFT Investment Platform
- Investment NFT contract with revenue sharing
- Global payment processing (crypto + fiat)
- Revenue distribution mechanisms
- SEZ compliance modules
- Multi-village governance systems
```

---

## 🔑 KEY DEVELOPMENT PATTERNS

### 1. Dual NFT Architecture - CRITICAL SEPARATION

**KYC ID NFTs (Indian Users):**
```motoko
// canisters/kyc-id-nft/
- Indian citizens only
- Aadhaar/PAN/retina verification
- INR payments via UPI/bank transfer
- Identity and access management
- NO financial returns - utility only
```

**Investment NFTs (Global Participants):**
```motoko
// canisters/investment-nft/
- Open worldwide participation
- Crypto payments (ETH, BTC, stablecoins)
- Revenue sharing from UrgamU operations
- Financial returns mechanism
- SEPARATE from KYC system
```

### 2. Nutrazz's Development Rules

**When Working on Baghpat Features:**
```typescript
// Focus: Indian User Experience
- Optimize for rural connectivity
- Hindi language support first
- Simple KYC flows for non-tech users
- Mobile-first design patterns
- Offline capability considerations
```

**When Working on UrgamU Investment Features:**
```typescript
// Focus: Global Investor Experience
- Multi-currency payment processing
- International compliance standards
- Transparent revenue reporting
- Investor communication tools
- Multi-language support (global)
```

---

## 🚨 CRITICAL SECURITY & COMPLIANCE

### Immediate Restrictions:
- **ALL SMART CONTRACTS UNAUDITED** - Testnet use only
- **NO REAL FUNDS** in any development or testing
- **KYC COMPLIANCE**: Strict separation of ID and investment systems
- **SEZ APPROVAL REQUIRED** before Urgam Valley deployment

### Regulatory Compliance Checklist:
- [ ] RBI compliance for INR NFT transactions
- [ ] SEBI regulations for investment instruments
- [ ] Aadhaar Act compliance for KYC integration
- [ ] International investment law for global NFTs
- [ ] Environmental compliance for Uttarakhand deployment

---

## 💬 COMMUNICATION PROTOCOLS

### Primary Decision Maker: **Nutrazz**
- All technical decisions require Nutrazz's approval
- Mobile app design follows Nutrazz's specified user flows
- NFT architecture maintains strict KYC/investment separation

### Escalation Path:
1. **Technical Issues**: Document in GitHub Issues
2. **Strategic Decisions**: Direct to Nutrazz for approval
3. **Security Concerns**: Immediate notification to Nutrazz + security team
4. **User Experience**: Follow Nutrazz's mobile-first rural design principles

---

**END OF COOPILOT INSTRUCTIONS - LAST UPDATED: October 2025**
**PRIMARY CONTACT: NUTRAZZ - One World Project Ambassador**


