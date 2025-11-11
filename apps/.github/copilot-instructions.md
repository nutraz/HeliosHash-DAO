# HeliosHash DAO — Copilot Agent Instructions

A multi-platform DAO ecosystem: Internet Computer backend, Next.js web app, Flutter mobile app, and social media orchestration framework.

## Architecture & Boundaries

### Multi-App Monorepo Structure

- **`backend/`**: Motoko canisters (ICP) + Node.js Express server
- **`web/`**: Next.js 14 web application (port 3002)
- **`mobile/`**: Flutter/Dart mobile application with IC integration
- **`social-media-framework/`**: Integration testing framework for social providers

### Backend Architecture

- **Motoko Canisters**: Business logic in `backend/src/helioshash_backend_backend/main.mo`
- **Node.js API**: Express server in `backend/src/` with controllers/routes/middleware
- **IC Integration**: DFX deployment config in `backend/dfx.json`
- **Cross-platform**: Same backend serves web, mobile, and external integrations

### Frontend Architecture

- **Web**: Next.js App Router (`web/src/app/`), React components (`web/src/components/`)
- **Mobile**: Flutter widgets (`mobile/lib/`), IC canister bindings (`mobile/lib/ic_canisters.dart`)
- **Shared Types**: IC-generated declarations in `web/src/declarations/`

## Key Patterns & Conventions

### Motoko Development

```motoko
// Keep simple actor definitions - complex logic goes in separate services
persistent actor {
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
};
```

### Web Development (Next.js)

```typescript
// Import IC declarations for type safety
import { createActor, canisterId } from "@/declarations/helioshash_backend";

// Use Zustand for state management
// TanStack Query for IC canister calls
// Radix UI + TailwindCSS for components
```

### Mobile Development (Flutter)

```dart
// IC integration through generated Dart bindings
// State management via providers in lib/providers/
// Models in lib/models/ (post_model.dart, project_model.dart, etc.)
// Screens organized by feature (governance_page.dart, rewards_page.dart)
```

### Testing Strategy

- **Web**: Vitest (`pnpm test:run`), Playwright E2E (`pnpm test:e2e`)
- **Mobile**: Flutter test suite with IC mocking
- **Social Framework**: Integration tests with `SAFE_MODE=true` (no live API calls)
- **Backend**: Motoko test runners + Node.js testing

## Developer Workflow

### Setup & Development

```bash
# Backend (IC + Node.js)
cd backend && dfx start --clean  # Local IC replica
dfx deploy                       # Deploy canisters + generate bindings

# Web development
cd web && pnpm dev              # Next.js dev server (port 3002)

# Mobile development
cd mobile && flutter run        # Flutter development

# Social media testing
cd social-media-framework && pnpm test:integration
```

### Build & Deployment

```bash
# Web production build
cd web && pnpm build

# Backend deployment
cd backend && dfx deploy --network ic

# Mobile builds
cd mobile && flutter build apk  # Android
cd mobile && flutter build ios  # iOS
```

## Integration Points & External Dependencies

### Internet Computer (IC)

- **DFX**: Manages canister lifecycle and generates TypeScript/Dart bindings
- **Candid**: Interface definitions for cross-language IC calls
- **Identity**: Uses Internet Identity for authentication

### Cross-Platform Communication

- **Web → IC**: Direct canister calls via `@dfinity/*` packages
- **Mobile → IC**: Dart-generated IC agent from same Candid definitions
- **Social Framework**: Orchestrates external social platforms (Twitter, Discord) with safety controls

### State Management

- **Web**: Zustand stores + TanStack Query for IC data fetching
- **Mobile**: Flutter providers (`dao_provider.dart`) + local state
- **Backend**: Motoko stable memory + Node.js in-memory caching

## Key Files & Directories

```
apps/
├── backend/
│   ├── dfx.json                    # Canister configuration
│   ├── src/helioshash_backend_backend/main.mo  # IC business logic
│   └── src/{controllers,routes,middleware}/    # Node.js API layer
├── web/
│   ├── src/app/                    # Next.js App Router pages
│   ├── src/components/             # React UI components
│   ├── src/declarations/           # IC-generated TypeScript bindings
│   └── package.json               # Web dependencies & scripts
├── mobile/
│   ├── lib/main.dart              # Flutter app entry point
│   ├── lib/ic_canisters.dart      # IC integration layer
│   ├── lib/models/                # Dart data models
│   └── pubspec.yaml               # Flutter dependencies
└── social-media-framework/
    ├── src/                       # Social provider abstractions
    └── test/                      # Integration test scaffolding
```

## Project-Specific Conventions

### Multi-Platform Consistency

- **Shared Data Models**: Keep IC Candid definitions as single source of truth
- **Authentication**: Internet Identity integration across web/mobile
- **API Patterns**: RESTful Node.js endpoints + direct IC canister calls
- **Error Handling**: Consistent Result patterns in Motoko, typed errors in TS/Dart

### Development Safety

- **SAFE_MODE**: Social framework tests avoid live API calls by default
- **Local Development**: Use `dfx start --clean` for clean IC replica state
- **Type Safety**: Leverage IC-generated bindings for compile-time validation
- **Environment Separation**: Local replica vs IC mainnet deployments

## Examples

### IC Canister Call (Web)

```typescript
import {
  createActor,
  canisterId,
} from "@/declarations/helioshash_backend_backend";

const actor = createActor(canisterId);
const greeting = await actor.greet("HeliosHash");
```

### IC Canister Call (Mobile)

```dart
// Use generated Dart agent
final result = await icAgent.call('greet', ['HeliosHash']);
```

### Social Framework Integration Test

```typescript
// Always runs in SAFE_MODE unless explicitly disabled
process.env.SAFE_MODE = "true";
process.env.MAX_POSTS_PER_DAY = "1";
```

---

Focus on cross-platform consistency, IC integration patterns, and maintaining type safety across the entire stack.
