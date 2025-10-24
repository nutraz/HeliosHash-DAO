<<<<<<< HEAD
# HeliosHash DAO — AI Coding Agent Instructions

HeliosHash DAO (HHDAO) is a solar infrastructure DAO for remote valley transformation in Urgam Valley, Uttarakhand, India. Built with Motoko canisters (Internet Computer) + Next.js frontend.

> **Note**: This file contains focused, actionable guidance for AI coding assistants. For detailed code examples and patterns, see `COPILOT_CONTEXT.md`.

## Architecture Overview

**Multi-Canister System**: 9+ specialized canisters in `dfx.json` - main coordinator (`hhdao`), DAO governance (`hhdao_dao`), identity management (`hhdao_identity`), plus compute, telemetry, documents, NFT, and token systems.

**Inter-Canister Communication**: The main `canisters/hhdao/src/main.mo` uses dependency injection pattern - canister principals passed as constructor parameters, not hardcoded. This enables testing and flexible deployment.

**Frontend Integration**: Next.js App Router in `src/app/` with auto-generated TypeScript bindings in `src/declarations/` for canister calls.

## Critical Development Patterns

### Motoko Canister Structure
```motoko
// canisters/hhdao/src/main.mo - thin actor wrapper
persistent actor class HHDAO(
  daoPrincipal : ?Principal,  // ← Injected dependencies
  identityPrincipal : ?Principal
) {
  // Business logic delegates to lib.mo
  public shared(msg) func createProposal(...) {
    await HHDAOLib.createProposal(...);  // ← Delegate to lib
  };
}
```

**Rule**: Keep `main.mo` thin (actor interface only), put business logic in `lib.mo`. Use `Result.Result<T, Text>` for error handling.

### Frontend Canister Integration
```typescript
// Correct pattern - use generated declarations
import { createActor } from '@/declarations/hhdao_dao';
const daoActor = createActor(process.env.CANISTER_ID_HHDAO_DAO!);

// Auth context pattern for stateful flows
const { user, isAuthenticated } = useAuthContext();  // localStorage-based mock
```

**Rule**: Always import actors from `src/declarations/`, use hooks in `src/hooks/` for auth flows, never call `@dfinity/agent` directly.

## Development Workflows

### Multi-Server Architecture
- `pnpm dev` - Desktop server (localhost:3001)
- `pnpm mobile` - Mobile server (network IP:3003) via `mobile_hhdao_server.js`
- Health monitoring at `/api/status`

### Testing Stack
- **Unit**: `pnpm test:run` (Vitest with 82 tests passing)
- **E2E**: `pnpm test:e2e` (Playwright with @smoke/@integration tags)
- **Canister**: `pnpm test:canister` (custom `canisters/test-runner/run-tests.sh`)
- **Mobile**: QR code access + responsive testing

### Custom Test Runner Pattern
```bash
# canisters/test-runner/run-tests.sh compiles and runs .test.mo files
MOC="$(dfx cache show)/moc"
$MOC -o wasm/test.wasm --package base "$(dfx cache show)/base" src/lib.mo test/test-utils.mo test/*.test.mo
```

**Rule**: Add new Motoko tests as `.test.mo` files using `TestUtils` assertions, not dfx test.

## Project-Specific Conventions

**Authentication**: Intentionally mocked (localStorage-based) - don't suggest "real" auth fixes.

**Mobile Focus**: Full mobile E2E experience with network accessibility, QR codes, responsive design optimization.

**1WP Integration**: OWP token integration with One World Project ecosystem - existing external dependency.

**Testing Tags**: Use `@smoke` for critical paths, `@integration` for canister tests, `@performance`/`@security` for specialized suites.

## Project Structure

```
HeliosHash-DAO/
├── canisters/              # Motoko backend canisters
│   ├── hhdao/             # Main business logic
│   │   ├── src/main.mo    # Actor entrypoint (thin)
│   │   ├── src/lib.mo     # Core logic
│   │   └── test/          # Motoko tests (.test.mo)
│   ├── hhdao_dao/         # DAO governance
│   ├── hhdao_identity/    # Identity management
│   ├── hhdao_compute/     # Mining compute stats
│   ├── hhdao_telemetry/   # Solar telemetry
│   └── test-runner/       # Custom Motoko test framework
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   │   └── ui/           # Shadcn/UI components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript interfaces
│   ├── declarations/     # Auto-generated canister bindings (DO NOT EDIT)
│   └── lib/              # Utility functions
├── tests/                 # E2E tests (Playwright)
├── dfx.json              # Canister configuration
├── package.json          # Frontend dependencies
└── mobile_hhdao_server.js # Mobile development server
```

## Code Style & Conventions

### Motoko
- Use 2-space indentation
- Prefix private functions with `_` (e.g., `_validateProposal`)
- Always use `Result.Result<T, Text>` for error handling
- Stable variables for persistent state: `private stable var`
- Document public functions with comments

### TypeScript/React
- Use 2-space indentation (enforced by Prettier)
- Prefer functional components with hooks
- Use `'use client'` directive for client components
- Import UI components from `@/components/ui/`
- Type all props with interfaces (not `any`)
- Use semantic HTML and ARIA attributes for accessibility

### Naming Conventions
- Files: kebab-case (`solar-project-card.tsx`)
- Components: PascalCase (`SolarProjectCard`)
- Functions/variables: camelCase (`fetchProposals`)
- Constants: UPPER_SNAKE_CASE (`MAX_PROPOSAL_DURATION`)
- Test files: `*.test.mo` (Motoko), `*.spec.ts` (TypeScript)

## Common Issues & Troubleshooting

### Canister Deployment Errors
- **Error: "Canister principal not found"** → Run `dfx deploy` first
- **Error: "Cannot find module '@/declarations/...'** → Run `dfx generate` to regenerate bindings
- **Outdated declarations** → Always run `dfx generate` after changing canister interfaces

### Frontend Build Issues
- **Module not found errors** → Check `package.json` dependencies, run `pnpm install`
- **Port already in use** → Desktop: 3001, Mobile: 3003 - check for conflicting processes
- **Environment variables missing** → Copy `.env.example` to `.env.local`

### Testing Issues
- **E2E tests failing** → Ensure dev server is running (`pnpm dev`)
- **Canister tests not found** → Tests must be in `canisters/*/test/*.test.mo`
- **Mobile tests not accessible** → Check network firewall, use `pnpm mobile` not `pnpm dev`

## Key Files for Context
- `dfx.json` - All canister definitions and dependencies  
- `canisters/hhdao/src/main.mo` - Main actor with dependency injection
- `src/hooks/useAuthContext.ts` - Auth pattern (localStorage mock)
- `mobile_hhdao_server.js` - Mobile network server
- `MANUAL_TESTING_GUIDE.md` - UI/UX testing procedures
- `TEST_INFRASTRUCTURE.md` - Testing patterns and factories

## Git Workflow
- **Branches**: `feature/*` for features, `fix/*` for bugs
- **Commits**: `type(scope): message` (e.g., `feat(dao): add proposal voting`)
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Focus**: Mobile responsiveness, UI polish, testing coverage

---

⚠️ **Do not suggest fixes for authentication, wallet, or UPI flows** — these are intentionally mocked in MVP. Focus on UI, navigation, form state, and mobile responsiveness.
=======

# HeliosHash DAO — Copilot Agent Instructions (October 2025)

HeliosHash DAO is a hybrid dApp: Motoko canisters (backend, ICP) and a Next.js/TypeScript frontend. This guide enables AI agents to be productive immediately.

## Architecture & Boundaries
- **Backend:** Motoko canisters in `canisters/` (business logic in `src/lib.mo`, actor entry in `src/main.mo`).
- **Frontend:** Next.js App Router in `app/`, React components in `src/components/`, hooks in `src/hooks/`.
- **Canister bindings:** Generated TypeScript in `src/declarations/` (run `dfx deploy` or `dfx generate`).
- **Testing:** Playwright (E2E, `pnpm test:e2e`), Vitest (unit, `pnpm test:run`), Motoko custom runner (`pnpm test:canister`).

## Key Patterns & Conventions
- **Motoko:** Keep business logic in `lib.mo`, actor wrappers in `main.mo`. Use `Result` for errors. Always use `async` for public functions. Use `shared ({ caller })` for identity.
- **Frontend:** Import canister actors from `src/declarations/`. Use hooks in `src/hooks/` for stateful/auth flows. UI components from `@/components/ui/`.
- **Auth:** Simulated only (localStorage/mock); do not implement real wallet or UPI flows.
- **TypeScript:** Use generated interfaces for canister responses. Prefer `@/*` alias for imports (see `tsconfig.json`).
- **Testing:** Add Vitest tests for React; Motoko tests in `canisters/hhdao/test/`.

## Developer Workflow
1. **Feature branch:** Create from `main` (use `feature/*` naming).
2. **Build:** `pnpm dev` (dev server, port 3001), `pnpm build` (production).
3. **Test:** `pnpm test:run` (unit), `pnpm test:e2e` (E2E), `pnpm test:canister` (Motoko).
4. **Deploy:** `dfx deploy` (local IC, generates bindings), `pnpm build:canisters` (compile canisters).
5. **Manual QA:** Update `MANUAL_TESTING_GUIDE.md` or `MOBILE-README.md` for platform-facing changes.

## Integration & External Dependencies
- **ICP:** All backend logic is Motoko on Internet Computer. Use DFX for build/deploy.
- **Mobile:** E2E flows use `mobile_hhdao_server.js` and QR scripts in `mobile-*.sh`.
- **Payment:** Integrates with One World Project rails (see docs for details).

## Key Files & Directories
- `dfx.json` — Canister config
- `package.json` — Dev/build/test scripts
- `canisters/hhdao/src/lib.mo` — Business logic
- `canisters/hhdao/src/main.mo` — Actor entrypoints
- `canisters/test-runner/run-tests.sh` — Motoko test runner
- `src/hooks/useAuthContext.ts` — Auth context pattern
- `app/` — Next.js App Router

## Examples
### Importing a Canister Actor (TypeScript)
```ts
import { createActor, canisterId } from '@/declarations/hhdao_dao';
const daoActor = createActor(canisterId);
const proposals = await daoActor.getProposals();
```

### Motoko Logic Delegation
```motoko
// canisters/hhdao/src/lib.mo
public func createProposal(...) : async Result.Result<Proposal, Text> { ... }

// canisters/hhdao/src/main.mo
actor HHDAO {
  public shared (msg) func createProposal(...) : async Result.Result<Proposal, Text> {
    await Lib.createProposal(...);
  }
}
```

## Limitations
- Auth, wallet, and UPI flows are mocked; do not implement real flows.
- State is in-memory unless otherwise specified.
- Follow actual code patterns, not aspirational docs.

---
If you update this file, keep it concise, accurate, and include code examples and exact scripts only.
>>>>>>> audit-clean
