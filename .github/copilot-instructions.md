# HeliosHash DAO — Copilot Agent Instructions (Oct 2025)

This repo is a hybrid dApp: Motoko canisters (Internet Computer) + Next.js/TypeScript frontend. For deeper examples, see `COPILOT_CONTEXT.md`.

## Architecture & Boundaries
- **Backend:** Motoko canisters in `canisters/` (entry: `main.mo`, business logic: `lib.mo`). Core: `canisters/hhdao/src/main.mo` (dependency-injected principals for inter-canister calls).
- **Frontend:** Next.js (custom server: `server.ts`). React UI in `src/components/`, hooks in `src/hooks/`. Routing: Next.js App Router (`app/`), API routes in `pages/api/`.
- **Bindings:** Use generated actors from `src/declarations/*` via `src/lib/canister-actors.ts` (e.g., `getCanisterActors()`, `createHHDAOActor()`). Regenerate with `dfx deploy` or `dfx generate`. Never import `@dfinity/agent` directly in client code.
- **Server:** `server.ts` integrates Socket.IO at `/api/socketio`, rate limits `/api/*`, supports optional bearer token (except `/api/status`). Auto-increments from port 3001, prints LAN URL + QR.

## Key Patterns
- **Motoko:** Keep `main.mo` thin; delegate to `lib.mo`. Public APIs: `async`, return `Result.Result<T, Text>`, use `shared ({ caller })` for identity. `hhdao` uses injected principals and lazy actor refs for cross-canister calls.
- **Orchestration:** `hhdao` exposes helpers like `createProject`, `joinPlatform`, `registerSolarDevice`, `uploadProjectDocument`, and `seed_data` (dev-only). Governance, applications, and NFT minting in `lib.mo`.
- **Frontend:** Client components start with `'use client'`. UI from `@/components/ui`. Use `@/*` alias (see `tsconfig.json`). Auth is mocked via `useAuthContext` (`src/hooks/useAuthContext.ts`, localStorage-backed).
- **Declarations:** Example: `import { createActor, canisterId } from '@/declarations/hhdao_dao'; const dao = createActor(canisterId);`. Never edit `src/declarations/` (regenerate only).

## Developer Workflows
- **Dev server:** `pnpm dev` (binds 0.0.0.0:3001, auto-fallback). Status: `GET /api/status` or `pnpm status`.
- **Mobile E2E:** `pnpm mobile` runs `mobile_hhdao_server.js` on 3003 with QR + LAN URL; `pnpm mobile:qr` for QR-only.
- **Tests:**
  - `pnpm test:run` (Vitest)
  - `pnpm test:e2e` (Playwright)
  - `pnpm test:canister` (Motoko runner: `canisters/test-runner/run-tests.sh`)
  - `pnpm test:all` (all tests)
  - Tags: `@smoke`, `@integration`, `@performance`, `@security`
- **Canisters:** `dfx start --background` → `dfx deploy` → `dfx generate` after candid changes. Build-only: `pnpm build:canisters`. Local replica: agent root key auto-fetched in dev.

## Project-Specific Conventions
- **No real auth/wallet/KYC:** All are mocked for MVP/tests.
- **Mobile-first:** Prioritize mobile responsiveness, QR flows, and network accessibility.
- **Motoko tests:** In `canisters/*/test/*.mo` (e.g., `canisters/hhdao/test/hhdao.test.mo`). Runner compiles wasm, executes via Node.
- **Frontend canister calls:** Always use generated actors via `src/lib/canister-actors.ts`. Never instantiate `HttpAgent` in React/client code.

## Key Files/Directories
- `dfx.json` (canister graph)
- `canisters/hhdao/src/main.mo` (DI + orchestration)
- `canisters/hhdao/src/lib.mo` (core logic)
- `canisters/test-runner/run-tests.sh` (Motoko tests)
- `server.ts` (custom Next.js + Socket.IO)
- `mobile_hhdao_server.js` (mobile dev)
- `src/hooks/useAuthContext.ts` (mock auth)
- `src/lib/canister-actors.ts` (typed actor factory)
- `package.json` (scripts)

## Gotchas
- If `@/declarations/*` imports fail, run `dfx deploy` or `dfx generate`.
- Port conflicts: Desktop 3001, Mobile 3003 (auto-increment). Use LAN URL from server.
- Fix merge markers (`<<<<<<<`, `>>>>>>>`) in Motoko/shell files before building/tests.
- Socket path: `/api/socketio` (do not proxy/block in dev).
- Never deploy to mainnet from this repo. All flows are testnet/dev only; contracts unaudited.

---

### UI & Design Principles
- **Palette:** Saffron (FF9933), White, Green (138808), Navy (0A1A2F), Electric Blue (00B4D8), Gold (FFD700)
- **Typography:** Modern sans-serif (Inter, Poppins)
- **Layout:** Card-based, Tailwind spacing, strong hierarchy
- **Accessibility:** ARIA labels, focus states, contrast, screen-reader support
- **Components:**
  - Tabs: Role-based, animated, pill/underline style
  - Buttons: Primary (saffron/green), secondary (outlined), icon, FAB
  - Dashboard: Top bar, sidebar/bottom nav, grid cards, skeleton loaders
  - Interactive: Toggles, progress, badge counters
- **i18n:** Wrap text in `t('key')` via `react-i18next`; language selector with flags
- **Mobile:** Tabs scroll/dropdown, full-width buttons, adaptive grid
- **Component Library:** Use/build under `src/components/ui/` (e.g., `Button.tsx`, `TabGroup.tsx`, `DashboardCard.tsx`, `RoleGuard.tsx`)
- **State:** React Context or Zustand for role/theme/language
