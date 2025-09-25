

# HeliosHash DAO (HHDAO) Copilot Instructions

## Project Overview
HeliosHash DAO is a **solar energy infrastructure DAO** built on Internet Computer (IC) with Motoko canisters and React frontend. Part of the One World Project ecosystem focused on India-specific solar projects and community governance.

**Tech Stack**: Motoko (backend), React + Vite + TypeScript (frontend), DFX (IC deployment), Playwright/Vitest (testing)

**Key Features**: Solar project management, DAO governance with proposals/voting, membership NFTs, basic auth system


## Architecture & Key Components

### Canisters (Motoko)
- **`canisters/hhdao/`**: Main business logic - projects, proposals, NFTs
  - `src/main.mo`: Actor entrypoint with all public methods
  - `src/lib.mo`: Core data types and business logic
  - `test/`: Motoko tests using custom TestUtils
- **`canisters/dao/`**: DAO governance (proposals, voting)
- **`canisters/identity/`**: User identity management
- **`canisters/telemetry/`**: Solar infrastructure data (stub)
- **`canisters/documents/`**: Document workflows (stub)

### Frontend (React + Vite)
- **`src/components/`**: Core UI components (Dashboard, SolarProjects, Governance, etc.)
- **`src/declarations/`**: Auto-generated TypeScript bindings for canisters
- **`src/hooks/`**: Custom React hooks (useAuth, useAuthContext)
- **`src/services/`**: API services (currently basic authService with in-memory storage)

## Developer Workflows

### Commands (package.json)
```bash
pnpm dev                    # Start development server
pnpm build                  # Build frontend (tsc + vite build) 
pnpm test:run              # Unit tests (Vitest)
pnpm test:e2e              # E2E tests (Playwright)
pnpm test:canister         # Motoko tests via canisters/test-runner/run-tests.sh
pnpm test:all              # All tests
dfx deploy                 # Deploy canisters to local IC
./deploy.sh                # Custom deployment script
```

### Canister Development
- Use `dfx deploy hhdao_dao` to deploy specific canisters
- Motoko tests use custom framework in `canisters/test-runner/`
- Test files end with `.test.mo` and use `TestUtils` helper
- Auto-generated TypeScript declarations in `src/declarations/`

## Conventions & Patterns

### Motoko Patterns
```motoko
// Standard canister structure (canisters/hhdao/src/main.mo)
import HHDAOLib "lib";
import Principal "mo:base/Principal";

actor {
  private let state = HHDAOLib.HHDAOState();
  
  public shared ({ caller }) func createProject(...) : async Project {
    state.createProject(..., caller)
  };
}
```

### Frontend Patterns
- **Components**: Use TypeScript, functional components with hooks
- **Auth**: Custom context provider in `hooks/useAuthContext.ts` with localStorage
- **Canister Integration**: Import from `src/declarations/[canister_name]/`
- **Routing**: React Router with routes in `App.tsx`
- **Styling**: Tailwind CSS with gradient backgrounds

### Testing Patterns
- **Motoko**: Custom test framework with `TestUtils.assertTrue()`, `TestUtils.printTestResult()`
- **Frontend**: Vitest for unit tests, Playwright for E2E
- **E2E**: Mock wallet connections using `page.addInitScript()`

## Integration Points

### IC/DFX Integration
- `dfx.json` defines 5 canisters: hhdao, hhdao_frontend, hhdao_dao, hhdao_identity, hhdao_telemetry, hhdao_documents
- Auto-generated TypeScript bindings create Actor interfaces
- Environment variables: `process.env.CANISTER_ID_HHDAO_*`

### Data Flow
1. Frontend components call canister methods via generated actors
2. Motoko actors delegate to lib modules for business logic
3. State managed in-memory (no persistent storage patterns visible)
4. Auth handled client-side with localStorage (basic implementation)

### External Dependencies
- **@dfinity/**: IC agent, candid, principal for canister communication
- **Framer Motion**: Animations in components
- **React Router**: Client-side routing
- **Tailwind**: Utility-first CSS

## Key Files to Understand
- `canisters/hhdao/src/lib.mo`: Core data types (Project, Proposal, NFT, MembershipTier)
- `src/App.tsx`: Main routing and layout
- `src/components/Dashboard.tsx`: Main dashboard with status and navigation
- `dfx.json`: Canister configuration and dependencies
- `canisters/test-runner/run-tests.sh`: Custom Motoko test runner

## Current Limitations
- Auth is basic in-memory simulation (not production-ready)
- Many features in documentation don't exist in code yet
- Government integration, account safety, and advanced features are aspirational
- Simple data models without persistence patterns

---

*Focus on the actual implemented patterns above. Many advanced features mentioned in documentation are not yet implemented.*