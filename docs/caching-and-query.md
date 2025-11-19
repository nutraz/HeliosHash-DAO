# Caching and React Query Integration

## Overview

Two-layer data strategy:

1. Simple in-memory TTL cache (`SimpleCache`) for synchronous reuse within a session.
2. React Query for request deduplication, background refetch, and UI-oriented cache control.

## Directory Structure

```
src/services/
  cache.ts
  cached/
    walletService.ts
    rewardsService.ts
  factory.ts
src/hooks/
  useQuery.ts
```

## SimpleCache API

```ts
cache.set(key, data, ttlMs?);
cache.get<T>(key): T | null;
cache.clear(key);
cache.clearAll();
cache.getStats();
```

Default TTL: 5 minutes (override per call).

## Cached Services

Each cached service wraps the mock service and consults the cache before delegating network (simulated) calls. Transactions are cached for 60s; all other entries default to 5m.

## React Query Hooks

| Hook                  | Key                       | Stale Time |
| --------------------- | ------------------------- | ---------- |
| useWalletBalance      | ['wallet','balance']      | 5m         |
| useWalletTransactions | ['wallet','transactions'] | 1m         |
| useRewardsSummary     | ['rewards','summary']     | 5m         |
| useRewardsSources     | ['rewards','sources']     | 5m         |

Invalidate helpers (`useInvalidateQueries`) support targeted or global refresh.

## Provider Setup

`src/app/providers.tsx` creates a single `QueryClient` with shared defaults (5m staleTime, retry=1, no window refocus refetch). Wrapped in `RootLayout`.

## Migration Pattern

Legacy custom hooks (useWalletData/useRewardsData) can be phased out:

1. Replace usage with React Query hook.
2. Remove bespoke loading & refetch state logic.
3. Use `invalidateWallet()` or `invalidateRewards()` for manual refresh.

## Testing Strategy

- Unit tests for `SimpleCache` ensure TTL, clearing, and statistics.
- Hook tests can wrap components in a `QueryClientProvider` (future addition) or keep existing direct custom hook tests.
- For deterministic cache tests, use fake timers (already applied in `cache.test.ts`).

## Future Enhancements

- Persistent storage (IndexedDB) hydration layer.
- Mutation hooks with optimistic updates.
- Automatic canister actor error categorization for smarter retry.
- Metrics collection (hit/miss ratio) exposed via `/api/status`.

## Best Practices

- Keep query keys consistent and hierarchical.
- Prefer invalidation over manual refetch where possible.
- Use cache for synchronous derived computations only when React Query abstraction is not needed.

---

This document will evolve as we introduce real canister-backed services and mutation flows.
