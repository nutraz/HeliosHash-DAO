# HeliosHash DAO — Copilot Agent Instructions

*Last updated: November 2025*

HeliosHash DAO is a decentralized renewable energy platform built on Internet Computer Protocol (ICP) with Motoko backend canisters, Next.js 14 web frontend, and Flutter mobile app. This is a **monorepo workspace** managed with pnpm.

## Project Structure

This is a **multi-platform monorepo**:

```
/
├── apps/
│   ├── web/          # Next.js 14 web app (App Router, port 3002)
│   ├── mobile/       # Flutter mobile app
│   └── backend/      # Legacy ICP backend (prefer /canisters)
├── canisters/        # Motoko smart contracts (30+ canisters)
│   ├── hhdao/        # Main DAO canister
│   ├── governance/   # Governance logic
│   ├── project_hub/  # Project management
│   └── ...
├── packages/         # Shared libraries
└── scripts/          # Dev/deployment scripts
```

## Architecture & Key Boundaries

### Backend: ICP Canisters (Motoko)
- **Pattern:** Business logic in `canisters/{name}/src/lib.mo`, actor wrapper in `main.mo`
- **Identity:** Use `shared ({ caller })` for authenticated calls
- **Errors:** Always return `Result.Result<T, Text>` from public functions
- **Dependencies:** Use injected principals (not hard-coded IDs) for inter-canister calls
- **Example canister structure:**
  ```motoko
  // canisters/hhdao/src/lib.mo
  module HHDAOLib {
    public func createProposal(...) : async Result.Result<Proposal, Text> { ... }
  }
  
  // canisters/hhdao/src/main.mo
  persistent actor class HHDAO(daoPrincipal: ?Principal, ...) {
    public shared (msg) func createProposal(...) : async Result.Result<Nat, Text> {
      await HHDAOLib.createProposal(...);
    }
  }
  ```

### Frontend: Next.js 14 Web App
- **Location:** `apps/web/src/`
- **Router:** App Router (NOT Pages Router) — routes in `apps/web/src/app/`
- **Port:** 3002 (run with `cd apps/web && pnpm dev`)
- **Auth:** Context pattern using `@/contexts/AuthContext` (localStorage-based mock)
- **ICP Integration:** Direct `Actor.createActor()` calls with programmatic IDL (see `apps/web/src/lib/api/heliosBaghpat.ts`)
- **Imports:** Use `@/` alias for `apps/web/src/` (configured in `tsconfig.json`)
- **Styling:** TailwindCSS + Radix UI components

**Auth pattern:**
```tsx
import { useAuth } from '@/contexts/AuthContext'

function Component() {
  const { user, isAuthenticated, login, logout } = useAuth()
  // Auth state persisted to localStorage
}
```

**Canister actor creation (no declarations needed):**
```typescript
import { Actor, HttpAgent } from "@dfinity/agent"

const agent = new HttpAgent({ host: process.env.NEXT_PUBLIC_IC_HOST })
const canisterId = process.env.NEXT_PUBLIC_PROJECT_HUB_CANISTER_ID
const actor = Actor.createActor(idlFactory, { agent, canisterId })
const result = await actor.get_project_stats()
```

### Mobile: Flutter 3.35.7
- **Location:** `apps/mobile/`
- **Platforms:** Android, iOS, Linux desktop
- **State:** Provider pattern
- **Key deps:** `supabase_flutter`, `flutter_secure_storage`, `web3dart`
- **Run:** `cd apps/mobile && flutter run` (or `-d linux` for desktop)

## Developer Workflow

### Setup & Build
```bash
# Root-level setup
pnpm install                    # Install all workspace deps

# Web development
cd apps/web
pnpm dev                        # Dev server on :3002

# Canister development
dfx start --background --clean  # Start local ICP replica
dfx deploy                      # Deploy all canisters
dfx generate                    # Generate TypeScript bindings (if using declarations)

# Mobile development
cd apps/mobile
flutter pub get
flutter run                     # Android/iOS
flutter run -d linux            # Linux desktop
```

### Testing
- **Unit (Web):** `pnpm test:run` (Vitest)
- **E2E (Web):** `pnpm test:e2e` (Playwright)
- **Canister:** `cd canisters/test-runner && ./run-tests.sh` (custom Motoko test runner using moc)

### Branch Strategy
- Feature branches: `feature/*`
- Work from `main` branch
- Mobile-specific updates: document in `MOBILE-README.md`

## Critical Conventions

1. **TypeScript:** Strict mode disabled (`strict: false`). Avoid `any` types; use proper interfaces.
2. **Canister bindings:** Generated bindings in `apps/web/src/declarations/` are optional. Prefer inline IDL or programmatic `Actor.createActor()`.
3. **Auth is mocked:** LocalStorage-based simulation only. No real wallet/UPI integrations.
4. **Port conflicts:** Web runs on 3002 (not 3001).
5. **Workspace commands:** Always run `pnpm` from root or app-specific directories.

## Key Files Reference

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Monorepo workspace config |
| `apps/web/package.json` | Web app scripts (`dev`, `build`, `test`) |
| `apps/web/src/contexts/AuthContext.tsx` | Auth state management |
| `apps/web/src/app/layout.tsx` | Root layout (wraps with `AuthProvider`) |
| `canisters/hhdao/src/lib.mo` | Main DAO business logic |
| `canisters/test-runner/run-tests.sh` | Motoko test runner script |
| `apps/mobile/pubspec.yaml` | Flutter dependencies |
| `dfx.json` | ICP canister configuration |

## Common Pitfalls

- **Don't** use `apps/backend/` — use `canisters/` for Motoko code
- **Don't** implement real wallet flows — auth is localStorage mock only
- **Don't** forget to run `dfx deploy` after canister changes
- **Don't** mix Pages Router patterns — this uses App Router
- **Do** use `@/` imports for web app code
- **Do** delegate Motoko logic to `lib.mo` modules
- **Do** use `Result.Result<T, Text>` for all canister public functions

## Dashboard Projects (Standalone Vite Apps)

Two production-ready dashboard projects exist as standalone Vite apps that demonstrate mature UI patterns:

### **1. Urgamu Project Dashboard** (`/urgamu-project-dashboard/`)
- **Purpose:** Complete project financial overview and DAO governance display
- **Tech:** Vite + React 19 + TypeScript + TailwindCSS
- **Key Components:**
  - `DataTable.tsx` - Reusable data grid with custom renderers
  - `Card.tsx`, `Section.tsx` - Layout primitives
  - `constants.tsx` - Comprehensive project data (financials, tokenomics, governance tiers)
- **Run:** `cd urgamu-project-dashboard && pnpm dev`
- **Integration Target:** Financial/governance sections in main web app

**Example pattern from Urgamu:**
```tsx
// Reusable DataTable with custom row renderer
<DataTable
  headers={['Phase', 'USD', 'INR', 'MATIC', 'ETH', 'BTC']}
  data={totalProjectCost}
  renderRow={(item) => (
    <tr className="border-b border-slate-700 hover:bg-slate-800/50">
      <td className="p-3 font-bold">{item.phase}</td>
      <td className="p-3 text-cyan">{item.usd}</td>
    </tr>
  )}
/>
```

### **2. Helios#Baghpat Village Dashboard** (`/helios#baghpat-dao-village-dashboard/`)
- **Purpose:** Live IoT data visualization and community management for Baghpat solar project
- **Tech:** Vite + React 19 + TypeScript + TailwindCSS
- **Key Components:**
  - `LiveDataView.tsx` - Real-time IoT metrics with auto-refresh
  - `Dashboard.tsx` - Tab navigation pattern (Overview, Live Data, Community, Opportunities)
  - `ProjectNode.tsx` - Project status cards
  - `CommunityHub.tsx`, `OpportunitiesBoard.tsx` - Community engagement interfaces
  - `IconComponents.tsx` - Custom icon library
- **Run:** `cd helios#baghpat-dao-village-dashboard && pnpm dev`
- **Integration Status:** **Already integrated** in `apps/web/src/app/projects/helios-baghpat/`
- **Live data hook:** See `apps/web/src/lib/api/heliosBaghpat.ts`

**Example pattern from Baghpat:**
```tsx
// Real-time data with simulated updates
useEffect(() => {
  const interval = setInterval(() => {
    setLiveData(prevData => ({
      ...prevData,
      current_kW: parseFloat((prevData.current_kW + (Math.random() - 0.5) * 2).toFixed(2)),
      today_kWh: Math.round(prevData.today_kWh + Math.random() * 2)
    }));
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

### Integration Strategy

**When to use dashboard components:**
- **Urgamu patterns:** For financial dashboards, governance displays, tokenomics tables
- **Baghpat patterns:** For live IoT data, real-time metrics, community dashboards
- **Shared patterns:** Authentication flows, tab navigation, data grids

**How to migrate components:**
1. Copy component from dashboard to `apps/web/src/components/dashboards/{project}/`
2. Update imports to use `@/` aliases
3. Adapt TailwindCSS classes (both use Tailwind v3+)
4. Replace mock data with canister calls using `Actor.createActor()`

**Don't duplicate:**
- These dashboards use **React 19** (main web app uses React 18.3.1)
- Keep dashboards as reference implementations
- Extract patterns, not entire codebases

## External Integration Notes

- **One World Project:** Payment rails integration (see docs for details)
- **Mobile E2E:** Uses `mobile_hhdao_server.js` and QR scripts
- **Telemetry:** IoT data integration via dedicated canister
- **Dashboard Projects:** Standalone Vite apps demonstrating production UI patterns (see Dashboard Projects section)

---

**If you update this file:** Keep examples concrete, reference actual file paths, and test all commands before documenting.
 
## Practical Examples & Troubleshooting

### Canister examples (short patterns)
- `canisters/hhdao/src/lib.mo` — business logic module
```motoko
module HHDAOLib {
  public func createProposal(title: Text, description: Text) : async Result.Result<Nat, Text> {
    // validation, persist, return id
  }
}
```

- `canisters/hhdao/src/main.mo` — actor wrapper (inject principals via constructor)
```motoko
persistent actor class HHDAO(controller: Principal) {
  public shared (msg) func createProposal(title: Text, description: Text) : async Result.Result<Nat, Text> {
    await HHDAOLib.createProposal(title, description);
  }
}
```

- `canisters/treasury_manager/src/lib.mo` — example return type
```motoko
public func transfer(to: Principal, amount: Nat) : async Result.Result<Bool, Text> {
  if (amount == 0) return #err("invalid amount");
  // transfer logic...
  return #ok(true);
}
```

Contract (short):
- Inputs: canonical types (Text, Nat, Principal)
- Outputs: `Result.Result<T, Text>` for public functions
- Error modes: validation errors, authorization, inter-canister call failures

### E2E / Vitest conflict (fix)
Problem: running Playwright and Vitest in the same environment caused errors like "Cannot redefine property: Symbol($$jest-matchers-object)" or "expect is not defined".

Fix strategy (practical):
1. Move jest-dom / testing-library setup into a Vitest-only setup file (example: `apps/web/vitest.setup.ts`) and reference it via `vitest.config.ts -> setupFiles`.
2. Ensure Playwright tests do NOT import the Vitest setup. Use Playwright's `expect` and its own fixtures.
3. Put shared helpers in a neutral module that exports functions (do not register globals).

Example `vitest.config.ts` snippet:
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts']
  }
})
```

Example `playwright.config.ts` guidance:
```ts
// Do NOT import vitest setup here. Keep Playwright isolated.
import { defineConfig } from '@playwright/test'
export default defineConfig({
  use: { headless: true }
})
```

### Dashboard migration checklist
- Copy one component at a time to `apps/web/src/components/dashboards/{project}`.
- Update imports to use `@/` aliases.
- Pin React versions where necessary (main app uses React 18.3.1; dashboards use React 19). Prefer lifting logic into framework-agnostic hooks/components.

### Troubleshooting: splash, old build, ports, caches
- Force heavy splash in dev (temporary): create `.env.local` in `apps/web` with:
```env
NEXT_PUBLIC_FORCE_HEAVY_SPLASH=true
```

- Clear caches and rebuild (safe):
```bash
# from repo root
pnpm install
rm -rf apps/web/.next .next node_modules apps/web/node_modules
cd apps/web && pnpm build
```

- Stop stray dev servers and check port 3002:
```bash
pkill -f "next dev" || true
ss -ltnp | grep 3002 || true
lsof -i :3002 || true
```

- Start dev server in foreground (recommended for debugging):
```bash
cd /home/nutarzz/HeliosHash-DAO/apps/web
env NEXT_PUBLIC_FORCE_HEAVY_SPLASH=true pnpm dev -p 3002
```

- Route verification helper (already included):
```bash
node apps/web/scripts/verify-routes.cjs
```

### Quick debug banner (optional)
If you want a visible banner when the heavy splash is skipped, add a small dev-only badge to `apps/web/src/app/layout.tsx` that renders when `process.env.NEXT_PUBLIC_FORCE_HEAVY_SPLASH !== 'true'`.

### Edge cases & recommended fixes
- Stale dev server: always `pkill -f "next dev"` before starting a new dev server.
- Hoisted/monorepo deps: run `pnpm -w install` at the repo root to ensure workspace resolution.
- Test runner conflicts: keep test setup isolated per runner.

## Small copies & snippets
- Verify routes: `node apps/web/scripts/verify-routes.cjs`
- Force heavy splash in dev: `NEXT_PUBLIC_FORCE_HEAVY_SPLASH=true pnpm dev -p 3002`
- Stop servers: `pkill -f "next dev" || true`

---
