# Dynamic API Route Warning

The build shows a warning about dynamic server usage in API routes. This is expected because:

1. **Canister Bindings**: The API routes import canister bindings that depend on runtime environment (e.g. local `dfx` host vs production host).
2. **Local Development**: The replica host and canister endpoints change between local (`localhost:4943`) and production environments.

## Why it happens

Next.js detects that the API route uses `headers` or other runtime-only features and therefore cannot prerender that route as static HTML. That triggers the "Dynamic server usage" message during build.

## Short-term options

- Mark the route explicitly dynamic (fast, temporary):

```ts
// in the API route file
export const dynamic = 'force-dynamic';
```

- Keep the API route, accept it's dynamic and keep using it for server-side canister calls.

- Use client-side only calls: remove the API route and call canisters directly from the client (recommended for simple read flows where authentication isn't required server-side).

## Long-term / production options

- Implement server-side delegation or an authenticated server identity for production so server routes can safely call canisters without relying on runtime headers.
- Use environment-specific builds or wrappers so `dfx`-dependent code is only imported when running locally.
- Generate TypeScript canister bindings at deploy time and reference stable modules rather than doing runtime imports.

## Quick guidance

- For local dev: leave the API route dynamic and run `dfx start --background` + `dfx deploy` when you need live canister data.
- For CI / build: ensure any canister calls that run during build are either stubbed/mocked or removed, or mark the route dynamic so the build knows it must run server-side at request time.

If you'd like, I can:
- Add `export const dynamic = 'force-dynamic';` to the specific API route file(s) for an immediate fix.
- Or convert the server routes to fully client-side calls and remove the dynamic usage.

Tell me which option you prefer and I will implement it.