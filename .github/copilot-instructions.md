# HeliosHash DAO — AI Coding Agent Instructions

HeliosHash DAO (HHDAO) is a solar infrastructure DAO for remote valley transformation in Uttarakhand, India. Built with Motoko canisters (Internet Computer) + Next.js frontend.

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

## Key Files for Context
- `dfx.json` - All canister definitions and dependencies  
- `canisters/hhdao/src/main.mo` - Main actor with dependency injection
- `src/hooks/useAuthContext.ts` - Auth pattern (localStorage mock)
- `mobile_hhdao_server.js` - Mobile network server
- `MANUAL_TESTING_GUIDE.md` - UI/UX testing procedures
- `TEST_INFRASTRUCTURE.md` - Testing patterns and factories

**Branches**: `feature/*` | **Commits**: `type(scope): message` | **Focus**: Mobile responsiveness, UI polish, testing coverage

---

⚠️ **Do not suggest fixes for authentication, wallet, or UPI flows** — these are intentionally mocked in MVP. Focus on UI, navigation, form state, and mobile responsiveness.