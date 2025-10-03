# React Query Setup Guide

This document describes the React Query configuration for the HeliosHash DAO application.

## Overview

We centralize configuration in `src/config/reactQueryConfig.ts` and expose a singleton `QueryClient` through `src/app/providers.tsx`.

## Configuration

```ts
export const reactQueryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: { retry: 1 },
  },
  devtools: {
    initialIsOpen: false,
    position: 'bottom-right',
    buttonPosition: 'bottom-right',
  },
} as const;
```

## Providers

`src/app/providers.tsx` creates a single `QueryClient` instance and mounts dynamic devtools only in development (or when `?devtools=true` is present):

```tsx
<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtoolsDynamic />
</QueryClientProvider>
```

## Devtools Loading

Dynamic import avoids SSR mismatches and production overhead. Force-enable via `?devtools=true`.

## Testing Utilities

`createTestQueryClient` and `createTestWrapper` in `src/test/utils/reactQueryUtils.ts` reduce duplication in hook tests.

## Best Practices

1. Use descriptive query keys (consider namespacing by feature).
2. Prefer `staleTime` + manual invalidation for server-side deterministic flows.
3. Keep mutations lean; push business logic to services.
4. Use optimistic updates with rollback for latency-sensitive UX.
5. Avoid overusing global cache for highly ephemeral UI state.

## Troubleshooting

| Issue              | Likely Cause                          | Fix                                                |
| ------------------ | ------------------------------------- | -------------------------------------------------- |
| Devtools warning   | Loaded during SSR or multiple clients | Ensure singleton + dynamic import                  |
| Cache not updating | Missing invalidation                  | Call `queryClient.invalidateQueries({ queryKey })` |
| Memory growth      | Long `gcTime` with large result sets  | Shorten or manually clear                          |

## Future Enhancements

- Add query hydration for SSR.
- Layer error boundary + toast integration for mutation errors.
- Introduce analytics of query counts in development.

---

Last updated: automated insertion.
