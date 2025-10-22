# HeliosHash DAO — AI Copilot Agent Instructions

**HeliosHash DAO (HHDAO)** is India's node of the **One World Project (1WP)**: a solar-energy DAO built on **Internet Computer (Motoko)** + **Next.js 15 (App Router)**. Mobile-first, rural-focused, targeting **Urgam Valley, Uttarakhand** pilot deployment.

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

## 🏗️ Architecture Overview

| Layer | Technology | Location | Critical Notes |
|-------|-----------|----------|----------------|
| **Frontend** | Next.js 15.5.4 (App Router) | `src/app/` | Use `'use client'` for interactivity |
| **UI Components** | shadcn/ui + Tailwind CSS | `src/components/ui/` | Saffron `#FF9933`, Green `#138808`, Navy `#0A1A2F` |
| **Backend** | Motoko canisters (IC) | `canisters/` | **UNAUDITED ⚠️** — 9 canisters (hhdao, identity, womens_incentive, dao, etc.) |
| **Bridge** | Solidity ↔ Motoko | `contracts/Bridge.sol` ↔ `canisters/bridge/` | CBOR/JSON payloads |
| **Auth** | Mocked (MVP) | `src/hooks/useAuthContext` | No real wallet integration — test accounts only |
| **Testing** | Vitest + Playwright + Motoko | `__tests__/`, `e2e/` | 82 tests passing (targeting 95%+ coverage) |
| **Mobile** | Responsive web + QR server | `mobile_hhdao_server.js` | LAN testing only — NO native apps |

### Tech Stack Version Lock
- **Next.js**: 15.5.4
- **React**: 19.0.0
- **TypeScript**: 5.7.3
- **Tailwind CSS**: 3.4.17
- **DFX**: 0.29.1
- **Node.js**: 18+ (pnpm 10.15.1)
- **Playwright**: 1.55.1 (E2E)
- **Vitest**: 3.2.4 (Unit)

---

## 🔑 Key Development Patterns

### 1. Motoko Canister Development

**Standard Function Signature:**
```motoko
// All public functions MUST follow this pattern
public shared ({ caller }) func myFunction(param: Type) : async Result.Result<T, Text> {
  // Validate caller permissions if needed
  if (not isAuthorized(caller)) {
    return #err("Unauthorized");
  };
  
  // Business logic delegated to lib.mo
  switch (LibLogic.processOperation(param)) {
    case (#ok(result)) { #ok(result) };
    case (#err(msg)) { #err(msg) };
  };
}
```

**Critical Rules:**
- ✅ **Always use `Result.Result<T, Text>`** for error handling
- ✅ **Extract business logic to `lib.mo`** — never duplicate across canisters
- ✅ **Validate `caller` identity** for privileged operations
- ❌ **Never expose internal state directly** — use getter functions

**Example Canister Structure:**
```
canisters/hhdao/
├── main.mo           # Public API surface
├── lib.mo            # Core business logic (reusable)
├── types.mo          # Type definitions
└── README.md         # Canister documentation
```

---

### 2. React + Internet Computer Integration

**✅ CORRECT: Use Pre-Generated Actors**
```typescript
// Import auto-generated actor
import { hhdao } from '@/declarations/hhdao';
import { identity } from '@/declarations/identity';

// Call canister methods
const result = await hhdao.createProposal(proposalData);
const userData = await identity.getUserProfile(userId);

// Handle Result type
if ('ok' in result) {
  console.log('Success:', result.ok);
} else {
  console.error('Error:', result.err);
}
```

**❌ WRONG: Manual HttpAgent Instantiation**
```typescript
// NEVER DO THIS — actors are pre-configured
const agent = new HttpAgent({ host: '...' });
const actor = Actor.createActor(idlFactory, { agent, canisterId });
```

**Actor Location:** `src/declarations/[canister_name]/index.js`

---

### 3. Women's Incentive System

**Design Principle:** Never hardcode gender — always query identity canister

```typescript
// ✅ Correct: Dynamic gender detection
const profile = await identity.getUserProfile(userId);
const rewardMultiplier = profile.isWoman ? 1.2 : 1.0;
const finalReward = baseReward * rewardMultiplier;

// ❌ Wrong: Hardcoded assumptions
const rewardMultiplier = 1.0; // BAD — ignores gender incentive
```

**Implementation Details:**
- **Data Source:** `isWoman: Bool` field in identity canister
- **Bonus Rate:** 1.2x multiplier (20% increase)
- **Canister:** `canisters/womens_incentive/main.mo`
- **Documentation:** `docs/GENDER_INCENTIVES_SYSTEM.md`

---

### 4. Mobile-First Development

**Force Mobile UI for Testing:**
```bash
# Add query parameter to any route
http://localhost:3001/dashboard?mobile=true
```

**Mobile Server Architecture:**
```bash
# Desktop dev server (localhost only)
pnpm dev  # → http://localhost:3001

# Mobile dev server (LAN accessible)
node mobile_hhdao_server.js  # → http://<YOUR_LOCAL_IP>:3003

# Generate QR codes for mobile access
node generate_mobile_qr.js
```

**Mobile Design Principles:**
- ✅ Touch-optimized controls (44px minimum tap target)
- ✅ Responsive layouts (Tailwind `md:` breakpoints)
- ✅ QR code accessibility for rapid testing
- ❌ **NO Flutter/Dart** — pure responsive web only

---

## 🛠️ Development Workflows

### Quick Start (Local Development)

```bash
# 1. Clone and install
git clone https://github.com/nutraz/HeliosHash-DAO.git
cd HeliosHash-DAO
pnpm install

# 2. Start local IC replica (if needed)
dfx start --clean --background

# 3. Deploy canisters to local replica
dfx deploy

# 4. Generate TypeScript declarations
dfx generate

# 5. Start dev server
pnpm dev  # → http://localhost:3001

# 6. (Optional) Start mobile server
node mobile_hhdao_server.js  # → http://<LAN_IP>:3003
```

### Testing Workflows

```bash
# Run all tests (unit + E2E + canister)
pnpm test:all

# Unit tests only (Vitest)
pnpm test:run

# E2E tests only (Playwright)
pnpm test:e2e

# Canister tests (Motoko)
pnpm test:canister

# Watch mode for development
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Canister Development Cycle

```bash
# 1. Modify canister code in canisters/[name]/main.mo

# 2. Redeploy canister
dfx deploy [canister_name]

# 3. Regenerate TypeScript declarations (CRITICAL)
dfx generate

# 4. Update frontend code using new declarations
# (Edit src/app/... or src/components/...)

# 5. Test changes
pnpm test:run
pnpm test:e2e
```

**⚠️ CRITICAL:** Always run `dfx generate` after canister changes. Frontend TypeScript files depend on auto-generated declarations.

---

## 📁 File Structure & Conventions

```
HeliosHash-DAO/
├── src/
│   ├── app/                          # Next.js App Router (pages)
│   │   ├── dashboard/page.tsx        # DAO dashboard
│   │   ├── community/page.tsx        # Job board platform
│   │   ├── governance/page.tsx       # Proposal voting
│   │   ├── projects/page.tsx         # Solar projects
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── community/opportunities/  # Job board components
│   │   │   ├── JobBoard.tsx          # Main board UI
│   │   │   ├── JobCard.tsx           # Individual job cards
│   │   │   ├── JobDetails.tsx        # Detail modal
│   │   │   └── filters/              # Filtering system
│   │   └── dashboard/                # Dashboard components
│   ├── hooks/
│   │   ├── useAuthContext.tsx        # Mock auth (⚠️ not production)
│   │   └── useCanister.tsx           # Canister interaction helpers
│   ├── lib/
│   │   ├── utils.ts                  # Shared utilities
│   │   └── canister-actors.ts        # Actor initialization
│   ├── types/
│   │   └── index.ts                  # TypeScript definitions
│   └── declarations/                 # ⚠️ AUTO-GENERATED — DO NOT EDIT
│       ├── hhdao/
│       ├── identity/
│       └── womens_incentive/
├── canisters/                        # Motoko backend (UNAUDITED ⚠️)
│   ├── hhdao/
│   │   ├── main.mo                   # Main DAO logic
│   │   ├── lib.mo                    # Core business logic
│   │   └── types.mo                  # Type definitions
│   ├── identity/                     # User identity registry
│   ├── womens_incentive/             # Gender-based rewards
│   ├── dao/                          # Governance canister
│   └── bridge/                       # Ethereum bridge
├── contracts/
│   └── Bridge.sol                    # Solidity bridge contract
├── e2e/                              # Playwright E2E tests
├── __tests__/                        # Vitest unit tests
├── docs/
│   ├── production-readiness-2025-10-20.md  # ⚠️ READ THIS
│   └── GENDER_INCENTIVES_SYSTEM.md
├── scripts/
│   └── launch_pilot.py               # ⚠️ NOT FOR PRODUCTION
├── dfx.json                          # Canister configuration
├── package.json
└── README.md
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **React Components** | PascalCase | `JobBoard.tsx`, `UserProfile.tsx` |
| **Hooks** | camelCase with `use` prefix | `useAuthContext.tsx`, `useCanister.tsx` |
| **Utilities** | camelCase | `formatCurrency.ts`, `validateInput.ts` |
| **Motoko Files** | snake_case | `main.mo`, `lib.mo`, `types.mo` |
| **Routes** | kebab-case | `app/job-board/page.tsx` |
| **CSS Classes** | Tailwind utilities | `bg-[#FF9933] text-white rounded-lg` |

---

## 🎨 Design System

### Brand Colors

```typescript
// Tailwind config custom colors
const colors = {
  saffron: '#FF9933',    // Primary brand color
  green: '#138808',      // Success/growth
  navy: '#0A1A2F',       // Dark backgrounds
};

// Usage in components
<div className="bg-[#FF9933] text-white">
  <h1 className="text-[#0A1A2F]">HeliosHash DAO</h1>
</div>
```

### Component Library

- **Primitives:** shadcn/ui (`src/components/ui/`)
- **Styling:** Tailwind CSS 3.4.17
- **Icons:** Lucide React (preferred), Heroicons (legacy)
- **Animations:** Framer Motion (planned), CSS transitions (current)

### Responsive Breakpoints

```typescript
// Tailwind default breakpoints
sm: '640px',   // Mobile landscape
md: '768px',   // Tablet
lg: '1024px',  // Desktop
xl: '1280px',  // Large desktop
2xl: '1536px', // Ultra-wide
```

---

## 🌐 Internationalization (i18n)

**Framework:** `react-i18next`

```typescript
// Usage in components
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.description', { count: 5 })}</p>
    </div>
  );
}
```

**Translation Files:** `public/locales/[lang]/translation.json`

---

## ⚠️ Anti-Patterns (What NOT to Do)

| ❌ DON'T | ✅ DO INSTEAD | Why? |
|----------|--------------|------|
| Edit `src/declarations/` manually | Run `dfx generate` after canister changes | Auto-generated files will be overwritten |
| Use `pages/` directory | Use `app/` (App Router only) | Next.js 15 uses App Router |
| Hardcode gender values | Read `isWoman` from identity canister | Women's incentive system requires dynamic data |
| Create Flutter/Dart mobile apps | Build responsive web UI only | Project mandate: web-only mobile |
| Instantiate `HttpAgent` directly | Use pre-generated actors from `@/declarations` | Actors are pre-configured with correct settings |
| Deploy to mainnet | Deploy to testnet only (`dfx deploy --network ic_test`) | Unaudited canisters — mainnet prohibited |
| Use real funds in testing | Use mock data and test accounts | NO REAL FUNDS until production audit |
| Commit `.env` files | Use `.env.local` (gitignored) | Secrets must never be committed |
| Skip tests | Write unit + E2E tests for all features | Target 95%+ coverage |

---

## 📚 Key Files Reference

### Configuration Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `dfx.json` | Canister configuration (IDs, networks, build settings) | Adding new canisters, changing networks |
| `package.json` | npm dependencies and scripts | Adding libraries, updating scripts |
| `tsconfig.json` | TypeScript compiler configuration | Changing module resolution, paths |
| `tailwind.config.ts` | Tailwind CSS customization | Adding custom colors, fonts, utilities |
| `next.config.mjs` | Next.js configuration | Environment variables, redirects, headers |

### Critical Implementation Files

| File | Purpose | Notes |
|------|---------|-------|
| `canisters/hhdao/main.mo` | Main DAO canister logic | **UNAUDITED** — core governance |
| `canisters/identity/main.mo` | User identity registry | Stores `isWoman` for incentive system |
| `src/hooks/useAuthContext.tsx` | Mock authentication | Replace with real wallet integration |
| `src/lib/canister-actors.ts` | Canister initialization helpers | Use for complex actor setup |
| `contracts/Bridge.sol` | Ethereum bridge contract | **UNAUDITED** — cross-chain integration |
| `mobile_hhdao_server.js` | Mobile LAN server | QR code + network accessibility |

### Documentation Files

| File | Purpose | Priority |
|------|---------|----------|
| `docs/production-readiness-2025-10-20.md` | Production gap analysis | 🔴 **READ FIRST** |
| `docs/GENDER_INCENTIVES_SYSTEM.md` | Women's bonus implementation | 🟡 High |
| `SECURITY.md` | Responsible disclosure policy | 🟡 High |
| `MANUAL_TESTING_GUIDE.md` | QA testing procedures | 🟢 Medium |
| `README.md` | Project overview (this file) | 🟢 Medium |

---

## 🚀 Quick Start Checklist

**Before starting work on HeliosHash DAO:**

1. ✅ **Read production readiness assessment** (`docs/production-readiness-2025-10-20.md`)
2. ✅ **Start local IC replica**: `dfx start --clean --background`
3. ✅ **Deploy canisters**: `dfx deploy`
4. ✅ **Generate TypeScript declarations**: `dfx generate`
5. ✅ **Verify mock auth state**: Check `useAuthContext` for test accounts
6. ✅ **Test mobile UI**: Add `?mobile=true` to any route
7. ✅ **Never commit to `src/declarations/`**: Auto-generated files
8. ✅ **Run tests before commits**: `pnpm test:all`
9. ✅ **Use testnet only**: Never deploy to mainnet (`--network ic`)
10. ✅ **Review security warnings**: All features are for testing only

---

## 🎯 Common Development Tasks

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/my-new-feature

# 2. Build UI components
# Create src/components/my-feature/MyComponent.tsx

# 3. Add route (if needed)
# Create src/app/my-feature/page.tsx

# 4. Add canister logic (if needed)
# Edit canisters/hhdao/main.mo and lib.mo

# 5. Redeploy and regenerate
dfx deploy hhdao
dfx generate

# 6. Write tests
# Create __tests__/my-feature.test.tsx
# Create e2e/my-feature.spec.ts

# 7. Run tests
pnpm test:all

# 8. Commit and push
git add .
git commit -m "feat(my-feature): Add new feature description"
git push origin feature/my-new-feature
```

### Debugging Canister Issues

```bash
# Check canister status
dfx canister status hhdao

# View canister logs
dfx canister logs hhdao

# Call canister method directly (CLI)
dfx canister call hhdao myFunction '("param1", "param2")'

# Check canister ID
dfx canister id hhdao

# Reset local state (nuclear option)
dfx stop
rm -rf .dfx/
dfx start --clean --background
dfx deploy
```

### Fixing Build Errors

```bash
# Clear Next.js cache
rm -rf .next/
pnpm build

# Clear node_modules and reinstall
rm -rf node_modules/
pnpm install

# Regenerate canister declarations
dfx generate

# Check TypeScript errors
pnpm tsc --noEmit
```

---

## 🔐 Security Considerations

### Current Security Status: 🔴 CRITICAL GAPS

| Area | Status | Risk Level | Mitigation |
|------|--------|------------|------------|
| Smart Contract Audit | ❌ Not Done | 🔴 Critical | **$40-50k required** — BLOCKER |
| Penetration Testing | ❌ Not Done | 🔴 Critical | **$15-25k required** |
| Legal Compliance | ❌ Not Done | 🔴 Critical | **$10-20k required** |
| Team Expansion | ⚠️ Solo Dev | 🟡 High | Need security/legal/DevOps hires |
| Test Coverage | 🔄 82 tests | 🟡 High | Target 95%+ coverage |

### Development Security Rules

1. **Never commit secrets** — use `.env.local` (gitignored)
2. **Never use real funds** — testnet and mock data only
3. **Never deploy to mainnet** — prohibited until audit complete
4. **Always validate user input** — XSS, injection prevention
5. **Always use `Result.Result`** — proper error handling in Motoko
6. **Report vulnerabilities privately** — see `SECURITY.md`

---

## 🤝 Contributing Guidelines

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Build process, dependencies

**Examples:**
```
feat(community): Add advanced job filtering system
fix(auth): Resolve mock user persistence issue
docs(readme): Update mobile testing instructions
test(e2e): Add job board navigation tests
```

### Pull Request Process

1. **Create feature branch** from `main`
2. **Write tests** for new functionality (target 95%+ coverage)
3. **Update documentation** if APIs change
4. **Run full test suite**: `pnpm test:all`
5. **Create PR** with clear description
6. **Request review** from maintainers
7. **Address feedback** and re-test
8. **Merge** after approval

### Code Review Checklist

- ✅ Tests pass locally
- ✅ No TypeScript errors
- ✅ Follows naming conventions
- ✅ Documentation updated
- ✅ No hardcoded secrets
- ✅ Mobile-responsive (test with `?mobile=true`)
- ✅ Canister changes include `dfx generate`
- ✅ Security considerations addressed

---

## 📞 Support & Resources

### Documentation
- [Internet Computer Docs](https://internetcomputer.org/docs)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Motoko Language Reference](https://internetcomputer.org/docs/current/motoko/main/about-this-guide)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Project Resources
- **GitHub Repository**: [nutraz/HeliosHash-DAO](https://github.com/nutraz/HeliosHash-DAO)
- **Production Readiness**: [docs/production-readiness-2025-10-20.md](docs/production-readiness-2025-10-20.md)
- **Security Policy**: [SECURITY.md](SECURITY.md)
- **Manual Testing Guide**: [MANUAL_TESTING_GUIDE.md](MANUAL_TESTING_GUIDE.md)

### 1WP Ecosystem
- [One World Project](https://www.oneworldproject.io/)
- [1WP DAO Platform](https://dapp.oneworldproject.io/)
- [UrgamU Smart City DAO](https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity)
- [UrgamU Documentation](https://sites.google.com/view/urgam-u/helioshash-dao)

---

## 🚨 FINAL REMINDER

**THIS IS AN EARLY ALPHA PROJECT**

- ⚠️ **NOT PRODUCTION READY** — Testnet/local development only
- 🔴 **UNAUDITED SMART CONTRACTS** — Professional audit required ($40-50k)
- 💰 **NO REAL FUNDS** — All features for testing/feedback only
- ⏱️ **8-12 MONTHS TO PRODUCTION** — Significant work required
- 🚫 **DO NOT DEPLOY TO MAINNET** — Prohibited until audit complete

**Production Readiness Score: 3.9/10**

See [Production Readiness Assessment](docs/production-readiness-2025-10-20.md) for full details.

---

**Last Updated:** October 22, 2025  
**Project Version:** Alpha Development Phase  
**Recommended for:** Development, testing, and feedback only
