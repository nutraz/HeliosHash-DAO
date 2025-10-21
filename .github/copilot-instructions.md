# HeliosHash DAO — Copilot Agent Instructions (October 2025)

This repo is a hybrid dApp: Motoko canisters (Internet Computer) + Next.js/TypeScript frontend. Keep this guide concise and follow code that exists. For deeper examples, see `COPILOT_CONTEXT.md`.

Architecture & boundaries
- Backend: Motoko canisters in `canisters/` (actor entry `main.mo`, business logic in `lib.mo` where present). Core coordinator is `canisters/hhdao/src/main.mo` using dependency-injected principals for inter-canister calls.
- Frontend: Next.js (custom server in `server.ts`). React components in `src/components/`, hooks in `src/hooks/`. Routes are handled by Next.js routing (App Router under `app/` where present; API routes also exist under `pages/api/`).
- Bindings: Use generated actors from `src/declarations/*` via helpers in `src/lib/canister-actors.ts` (e.g., `getCanisterActors()`, `createHHDAOActor()`). Regenerate via `dfx deploy` or `dfx generate`. Do not import `@dfinity/agent` directly in client components.
- Canisters: See `dfx.json` (DAO, identity, telemetry, documents, compute, NFT, treasury, OWP token, etc.).
- Server: `server.ts` integrates Socket.IO at `/api/socketio`, rate limits `/api/*` and supports optional bearer token (except `/api/status`). Auto-increments from port 3001 and prints a LAN URL + a QR.

Key patterns
- Motoko: Keep `main.mo` thin; delegate to `lib.mo`. Public APIs are `async`, return `Result.Result<T, Text>`, and use `shared ({ caller })` for identity. The `hhdao` canister uses optional injected principals and lazy actor refs for cross-canister calls.
- Motoko extras: `hhdao` exposes orchestration helpers like `createProject`, `joinPlatform`, `registerSolarDevice`, `uploadProjectDocument`, plus a `seed_data` method for dev-only data population. Governance, applications, and simple NFT minting live in `lib.mo`.
- Frontend: Client components start with `'use client'`. Import UI from `@/components/ui`. Prefer `@/*` alias (see `tsconfig.json`). Auth is mocked via `useAuthContext` (`src/hooks/useAuthContext.ts`) backed by localStorage.
- Declarations: Example: `import { createActor, canisterId } from '@/declarations/hhdao_dao'; const dao = createActor(canisterId);` Never edit files under `src/declarations/` (regenerate instead).

Developer workflows
- Dev server: `pnpm dev` (binds 0.0.0.0:3001; auto-fallback on conflict). Status: `GET /api/status` or `pnpm status`.
- Mobile E2E: `pnpm mobile` runs `mobile_hhdao_server.js` on 3003 with QR + LAN URL; `pnpm mobile:qr` for QR-only.
- Tests: `pnpm test:run` (Vitest), `pnpm test:e2e` (Playwright), `pnpm test:canister` (Motoko runner at `canisters/test-runner/run-tests.sh`), `pnpm test:all` to run all. Tags: `@smoke`, `@integration`, `@performance`, `@security`.
- Canisters: `dfx start --background` → `dfx deploy` → `dfx generate` when candid changes. Build-only: `pnpm build:canisters`. If using local replica, ensure agent root key is fetched (dev does this automatically).

Project-specific conventions
- Do not implement “real” auth, wallet, UPI, or KYC flows; these are intentionally mocked for MVP and tests.
- Focus on mobile responsiveness and end-to-end UX. Network accessibility and QR flows are first-class in dev.
- Tests for Motoko live under `canisters/*/test/*.mo` (e.g., `canisters/hhdao/test/hhdao.test.mo`). The runner compiles a wasm and executes via Node.
- Frontend canister calls must go through generated actors in `src/declarations/*`, preferably via `src/lib/canister-actors.ts` helpers; do not new up `HttpAgent` in React/client code.

Key files to reference
- `dfx.json` (canister graph), `canisters/hhdao/src/main.mo` (DI + orchestration), `canisters/hhdao/src/lib.mo` (core types/logic), `canisters/test-runner/run-tests.sh` (Motoko tests), `server.ts` (custom Next.js + Socket.IO + /api/status), `mobile_hhdao_server.js` (mobile dev), `src/hooks/useAuthContext.ts` (mock auth), `src/lib/canister-actors.ts` (typed actor factory), `package.json` (scripts).

Gotchas
- If imports like `@/declarations/*` fail, run `dfx deploy` or `dfx generate` to refresh bindings.
- Port conflicts: Desktop 3001, Mobile 3003 (server will auto-increment if busy). Use the LAN URL printed by the server.
- Keep changes aligned with existing patterns; avoid adding new auth/payment stacks.
- Some Motoko and shell files currently contain unresolved merge markers (`<<<<<<<`, `>>>>>>>`). Fix these in `canisters/hhdao/src/main.mo`, `canisters/hhdao/src/lib.mo`, and `canisters/test-runner/run-tests.sh` before building/tests.
- Socket path is `/api/socketio`; avoid proxying or blocking this route during dev.
- Never deploy to mainnet from this repo. All flows are testnet/dev only; contracts are unaudited.

If anything here seems off or incomplete, tell the maintainer what context is missing and propose a focused update to this file.

---

### 🎨 Design Principles
- Color Palette:
	- Primary: Saffron (hex FF9933), White, Green (hex 138808) — Indian flag
	- Background: Deep Navy Blue (hex 0A1A2F) or Midnight Blue (hex 0F172A) for contrast and elegance
	- Accent: Electric Blue (hex 00B4D8) or Gold (hex FFD700) for interactive elements
- Typography: Clean, modern sans-serif (e.g., Inter, Poppins) with strong hierarchy
- Spacing & Layout: Consistent padding/margin (Tailwind spacing scale), card-based modular design
- Accessibility: ARIA labels, focus states, sufficient contrast, and screen-reader support

### 🧩 Core UI Components

#### 1. Navigation Tabs (Role-Based)
Use animated, segmented tabs that adapt to user role:

```tsx
// Example: Role-based dashboard tabs
const tabs = {
	'Community Member': ['Jobs', 'Training', 'My NFT', 'DAO Votes'],
	Investor: ['Portfolio', 'Staking', 'Mining Stats', 'Proposals'],
	Authority: ['Compliance', 'IoT Feeds', 'Approvals', 'Reports']
};
```

- Style with rounded pill tabs or underline indicators
- Highlight active tab with saffron or electric blue

#### 2. Buttons
Categorize by function and priority:
- Primary: Solid saffron/green with white text → key actions (e.g., “Stake OWP”, “Apply Now”)
- Secondary: Outlined in white/electric blue → less critical (e.g., “View Details”)
- Icon Buttons: For actions like notifications, settings, language switch
- Floating Action Button (FAB): Bottom-right for main CTA (e.g., “+ New Proposal”)

```tsx
// Tailwind example (approximate saffron)
<button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg">
	Join DAO
</button>
```

#### 3. Dashboard Layout
- Top Bar: Logo, wallet connect, language selector, notifications bell
- Sidebar (desktop) / Bottom Nav (mobile): Role-adaptive navigation
- Main Content: Grid of interactive cards with consistent spacing
	- Each card = one feature (e.g., “Mining Stats”, “Pending KYC”, “Active Proposals”)
	- Use skeleton loaders during data fetch

#### 4. Interactive Elements
- Toggle switches for settings (green when active)
- Progress indicators for onboarding/KYC steps
- Badge counters on tabs (e.g., “Proposals (3)”) 

### 🌐 Multi-Language & Accessibility
- Wrap all text in `t('key')` via `react-i18next`
- Language selector in top bar with flag icons
- Ensure all buttons/tabs have:
	- `aria-label`
	- Keyboard navigability
	- Visible focus rings

### 📱 Mobile Responsiveness
- Tabs → horizontal scroll or dropdown on small screens
- Buttons → full-width with generous tap targets (min 48x48px)
- Use adaptive layouts (e.g., grid → single column)

### 🛠️ Tech Implementation Tips
- Framework: Next.js + React + Tailwind CSS
- Component Library: Build/reuse components under `src/components/ui/`:
	- `Button.tsx`
	- `TabGroup.tsx`
	- `DashboardCard.tsx`
	- `RoleGuard.tsx` (conditionally render UI by role using `useAuthContext`)
- State Management: Use React Context or Zustand for role/theme/language state
