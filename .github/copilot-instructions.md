<<<<<<< HEAD
---

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
