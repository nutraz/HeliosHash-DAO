# Service Layer Architecture

The service layer abstracts data access for UI hooks/components, enabling a clean swap from mock/local implementations to real canister (IC) calls or other backends without touching presentation code.

## Goals

- Decouple UI from data source details
- Provide deterministic shapes for hooks to consume
- Centralize domain logic (transformations, aggregation, fallback strategies)
- Enable progressive enhancement (add caching, retries, react-query later)

## Current Services

| Service        | File                                  | Provides                                              |
| -------------- | ------------------------------------- | ----------------------------------------------------- |
| WalletService  | `src/services/mock/walletService.ts`  | Balance summary + transactions (summary only for now) |
| RewardsService | `src/services/mock/rewardsService.ts` | Rewards summary + per-source breakdown                |

Shared type definitions live in `src/services/types.ts`.

## Directory Structure (Current)

```
src/services/
  factory.ts          # Centralized service accessor / DI-lite
  index.ts            # Barrel exports (types, factory, mock singletons)
  types.ts            # Domain + interface definitions
  mock/
    walletService.ts  # MockWalletService + default singleton export
    rewardsService.ts # MockRewardsService + default singleton export
```

Planned future addition:

```
  ic/                 # Real canister-backed implementations
    walletService.ts
    rewardsService.ts
```

## Interfaces

```ts
export interface WalletService {
  getBalance(): Promise<WalletData>;
  getTransactions(): Promise<Transaction[]>; // not yet used in UI
}

export interface RewardsService {
  getRewardsSummary(): Promise<RewardsData>;
  getRewardsBySource(): Promise<RewardsSource[]>;
}
```

## Hook Consumption Pattern

Hooks wrap services to provide a stable React-friendly contract including loading state, error, and a `refetch` callback.

Example (`useWalletData`):

```ts
const { data, isLoading, error, refetch } = useWalletData();
```

UI components then derive fields:

```ts
const balance = data?.balance ?? 0;
```

This avoids breaking when fields are added later.

## Error & Retry Strategy

- Each hook owns transient state (loading/error)
- `refetch` performs idempotent re-load (no cancellation token yet; acceptable for mock stage)
- Future: integrate AbortController for rapid re-requests

## Migration Path to Real Canisters

1. Create new folder `src/services/ic/` with implementations calling generated actors.
2. Keep interface signatures identical; map candid responses -> domain types.
3. Use existing `ServiceFactory` to select implementation based on environment flag (NODE_ENV, feature flag, or dynamic config).
4. Hooks now already consume the factory so no further UI changes are needed when swapping implementations.

## Testing Guidance

- Unit test services in isolation with deterministic timers (e.g., vi.useFakeTimers())
- Hook tests can either:
  - Initialize the factory with test doubles: `ServiceFactory.initialize(customWallet, customRewards)`
  - Or spy on the singleton service returned by the factory.
- Prefer not to mock formatting utilities—treat them as stable pure functions.

## Future Enhancements

- Introduce react-query for caching/invalidation
- Add optimistic update pattern for future mutative endpoints
- Implement exponential backoff retry for transient network errors
- Add metrics/logging wrapper (time to resolve, error codes) feeding existing `/api/status` diagnostics

## Anti-Patterns Avoided

- Direct fetch logic inside components
- Hard-coded mock data duplicated per hook
- Inconsistent loading/error semantics

## Decision Record

Initial implementation chooses explicit hook state vs. react-query to reduce upfront cognitive load and keep the diff surface minimal while establishing contracts. The factory pattern was added subsequently to enable dependency injection for tests and future environment-based swapping without rewriting hooks.

## Glossary

- Summary Object: Aggregated numeric fields (e.g., `WalletData`, `RewardsData`).
- Source Breakdown: Array form used for charts and distribution UIs.

---

Maintained as part of the currency and service abstraction initiative. Update this file when adding new services or extending interfaces.
