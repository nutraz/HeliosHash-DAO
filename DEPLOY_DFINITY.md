# DFINITY Local Deploy & Next.js Integration (Quickstart)

This file documents a minimal local workflow to bring up DFINITY canisters and connect the Next.js app for development.

1) Start a local replica

```bash
dfx start --background --clean
```

2) Deploy canisters

```bash
dfx deploy
```

3) Export environment variables for the web app

```bash
export NEXT_PUBLIC_IC_HOST=http://localhost:4943
export NEXT_PUBLIC_DAO_CANISTER_ID=$(dfx canister id dao)
# add other canister ids as needed, e.g. project_hub, treasury
```

4) Run the Next.js dev server (root of repo)

```bash
pnpm dev
```

Notes & Integration hints
- The current server API routes (`/api/helios/*`) use `src/lib/dfinity.ts` helpers. Those helpers currently rely on `AuthClient` (browser) for authenticated identity.
- For server-side canister calls you have several options:
  - Use a server-side identity (HSM/private key) to create an `HttpAgent` in Node and call canisters from API routes.
  - You can provide a server identity to the app via an environment variable `DFINITY_SERVER_KEY_B64` (base64 of the raw Ed25519 secret key bytes).
    Example workflow to generate and export a base64 secret (developer-only):

    ```bash
    # generate an Ed25519 keypair using Node (requires Node >= 16)
    node -e "const crypto = require('crypto'); const { generateKeyPairSync } = crypto; const { privateKey } = generateKeyPairSync('ed25519'); const der = privateKey.export({ type: 'pkcs8', format: 'der' }); console.log(Buffer.from(der).toString('base64'))" > server-key-pkcs8.b64
    # NOTE: The native Ed25519 secret format expected by `@dfinity/identity` is the raw secret key bytes (64 bytes).
    # Converting PKCS8 DER to raw secret may require a small script or using @dfinity/identity helpers. For simplicity in local dev,
    # you can reuse an existing `dfx` identity key file or construct the raw secret key and base64-encode it.

    export DFINITY_SERVER_KEY_B64="<base64-raw-secret-key>"
    ```
  - Proxy client-signed messages to the server (verify signatures) and then perform canister calls server-side.
  - Continue to use client-side `AuthClient` and call canisters from the browser, but be mindful of bundling — prefer to call canisters from server endpoints to keep secrets/logic on the server.

Troubleshooting
- If you see `indexedDB is not defined` during `next build`, it means a browser-only library (AuthClient) was imported on the server. Use the `connectToCanisters` guard in `src/lib/dfinity.ts` to avoid importing `AuthClient` when `typeof window === 'undefined'`.
- If canister IDs are missing, run `dfx canister create <name>` and then `dfx deploy`.

Security
- Never commit private keys or production identities to the repository. Use environment variables or a secrets manager for server identities.

Example env vars for server identity

```bash
# set the local replica host
export NEXT_PUBLIC_IC_HOST=http://localhost:4943
# provide the DAO canister id (after dfx deploy)
export NEXT_PUBLIC_DAO_CANISTER_ID=$(dfx canister id dao)
# base64-encoded raw Ed25519 secret key for server identity (developer-only)
export DFINITY_SERVER_KEY_B64="<your-base64-secret>"
```

If you have generated TypeScript actor bindings (via `dfx generate` or other tooling),
you can instruct the server to import them at runtime by setting `DAO_BINDINGS_PATH`.
For example, if bindings are available at `./src/declarations/dao`, export:

```bash
export DAO_BINDINGS_PATH='./src/declarations/dao'
```

The server will then attempt to import the module at runtime and call available
methods such as `getProjects` or `listProjects`. This import is conditional so
it won't break Next.js builds when the bindings are not present.
