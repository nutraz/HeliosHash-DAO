
## HeliosHash DAO — Copilot guidance (short)

HeliosHash DAO (HHDAO) combines Motoko canisters (backend) and a Next.js + TypeScript frontend. This file gives focused, actionable rules for an AI coding assistant so it can be productive immediately.

⚠️ **Do not suggest fixes for authentication, wallet, or UPI flows** — these are intentionally mocked in MVP. Focus on UI, navigation, form state, and mobile responsiveness.

Quick facts:
- Backend: Motoko canisters under `canisters/` (main business logic in `canisters/hhdao/src/lib.mo` and `main.mo`).
- Frontend: Next.js App Router in `src/app/`, components in `src/components/`, hooks in `src/hooks/`.
- Tooling: `dfx.json` (canisters), `package.json` (pnpm scripts), Playwright (E2E) and Vitest (unit).

Actionable rules for edits and suggestions:
- Keep Motoko canister boundaries: change business logic in `lib.mo`; keep actor entry in `main.mo` thin. See `canisters/test-runner/run-tests.sh` for test patterns.
- Frontend must import canister actors from `src/declarations/`; prefer hooks in `src/hooks/` for auth/stateful flows (see `src/hooks/useAuthContext.ts`).
- Use existing scripts only: `pnpm dev`, `pnpm test:e2e`, `pnpm test:canister`, and `dfx deploy`. Don’t suggest unfamiliar global tools.
- Tests: add Vitest tests for React components and Motoko `.test.mo` using `TestUtils`. Tag Playwright tests with `@smoke`/`@integration` as appropriate.

Minimal examples (literal)

1) Frontend — Importing a canister actor (TypeScript)

```ts
// Correct way to use canister actors in frontend
import { createActor } from '@/declarations/hhdao_dao';
const daoActor = createActor(process.env.NEXT_PUBLIC_DAO_CANISTER_ID!);
```

// Call canister method (example: fetch proposals)
const proposals = await daoActor.getProposals();

Always use `createActor` from generated declarations. Never hardcode canister IDs or use `@dfinity/agent` directly.

2) Motoko — Business logic in `lib.mo`, not `main.mo`

```motoko
// canisters/dao/src/lib.mo
import Types "Types";

public func createProposal(
  title: Text,
  description: Text,
  proposer: Principal
): async Result.Result<Proposal, Text> {
  // ← Pure logic here
};
```

```motoko
// canisters/dao/main.mo
import Lib "lib";
import Types "Types";

actor DAO {
  public shared(msg) func createProposal(...) : async Result.Result<Proposal, Text> {
    await Lib.createProposal(...); // ← Thin wrapper
  };
};
```

Keep `main.mo` minimal — delegate to `lib.mo`. Use `Result` for error handling.

Verified pnpm scripts (subset from `package.json`)

Use only these pnpm scripts:
- dev: starts desktop server (port 3001)
- mobile: starts network-accessible mobile server (`mobile_hhdao_server.js`)
- test:e2e: runs Playwright tests
- test:canister: runs Motoko tests (`canisters/test-runner/run-tests.sh`)
- build:canisters: compiles canisters (`dfx build`)


Integration notes:
- Canister IDs come from environment vars (`CANISTER_ID_HHDAO_*`) and `dfx.json`.
- Mobile E2E flows use `mobile_hhdao_server.js` and QR utilities in `mobile-*.sh`.

Repository conventions:
- Branches: `feature/*`. Commits follow `type(scope): message`.
- Prefer small, test-covered PRs and update `MANUAL_TESTING_GUIDE.md` or `MOBILE-README.md` when adding platform-facing behavior.

Files to read first when unsure: `dfx.json`, `package.json`, `canisters/hhdao/src/lib.mo`, `canisters/hhdao/src/main.mo`, `src/hooks/useAuthContext.ts`, `canisters/test-runner/run-tests.sh`, `MANUAL_TESTING_GUIDE.md`.



If you update this file, keep it short and include file examples and exact scripts.






































































































































































































































































































































































































































































































































































































































































































































 + React)
- `src/components/`: UI components (JobBoard, Dashboard, Governance, etc.)
- `src/app/`: Next.js App Router pages (community, dashboard, mining, etc.)
- `src/hooks/`: Custom React hooks (`useAuthContext` for localStorage-based auth)
- `src/services/`: API services (authService, canister integration)
- `src/declarations/`: Auto-generated TypeScript bindings for canisters

## Developer Workflows

### Common Commands (see `package.json`)
```bash
pnpm dev            # Start dev server (localhost:3001)
pnpm build          # Production build
pnpm test:run       # Unit tests (Vitest)
pnpm test:e2e       # E2E tests (Playwright)
pnpm test:canister  # Motoko canister tests (custom runner)
pnpm test:all       # Run all tests
dfx deploy          # Deploy canisters to local IC
./deploy.sh         # Custom deployment script
node mobile_hhdao_server.js  # Mobile E2E server
python3 launch_pilot.py      # Pilot automation
```

### Canister & Test Patterns
- Motoko tests: `canisters/test-runner/run-tests.sh` compiles and runs `.test.mo` files using `TestUtils` assertions
- Canister methods delegate to lib modules for business logic
- Inter-canister calls use injected principals for modularity

### Frontend Patterns
- Components: TypeScript, functional, hooks-based
- Auth: LocalStorage simulation via `useAuthContext.ts` (not production-ready)
- Canister integration: Import actors from `src/declarations/`
- Routing: Next.js App Router
- Styling: Tailwind CSS, Shadcn/UI, gradient backgrounds

### Testing Patterns
- Unit: Vitest for frontend, custom Motoko for backend
- E2E: Playwright (browser, mobile, QR flows)
- Manual: See `MANUAL_TESTING_GUIDE.md`

## Integration Points

- `dfx.json`: Defines all canisters and dependencies
- TypeScript actors auto-generated for canister calls
- Environment: `process.env.CANISTER_ID_HHDAO_*` for canister IDs
- `/api/status`: Health endpoint for monitoring

## Key Files & Directories
- `canisters/hhdao/src/lib.mo`: Core types and business logic
- `canisters/hhdao/test/hhdao.test.mo`: Motoko unit tests
- `canisters/test-runner/run-tests.sh`: Motoko test runner
- `src/hooks/useAuthContext.ts`: Auth context pattern
- `src/services/authService.ts`: Auth service (DFINITY AuthClient)
- `src/app/community/`: Job board platform
- `src/components/community/opportunities/`: Job board UI
- `package.json`: All dev/test/build commands
- `dfx.json`: Canister config

## Project-Specific Conventions
- Feature branches: `feature/your-feature-name`
- Commits: `type(scope): description`
- All new features require tests and documentation
- Use `TestUtils` for Motoko assertions
- Use Playwright tags for test categories (`@smoke`, `@integration`, etc.)

## Limitations & Warnings
- Auth is simulated (localStorage/mock); not production-ready
- Many features in docs are aspirational, not implemented
- No persistent storage patterns; state is in-memory

---

_Focus on real, implemented patterns. Ignore aspirational features unless code exists._
