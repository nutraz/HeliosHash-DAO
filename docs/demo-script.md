# Demo script (3-5 minute flow)

1. Start local replica + deploy
   ```bash
   dfx start --background
   dfx deploy
   ```

2. Start web dev server
   ```bash
   cd apps/web
   pnpm install
   pnpm dev
   ```

3. Seed demo (use your identity or pass a principal)
   ```bash
   DEMO_PRINCIPAL=$(dfx identity get-principal) ./scripts/demo/seed.sh $DEMO_PRINCIPAL 10000
   ```

4. Open dashboard at http://localhost:3002 (or port your app uses)
   - View demo balance & last-5 transactions
   - Create a mock project (UI uses fixtures)
   - Demonstrate an upgrade flow (UI calls mocked `burnForUpgrade`)

5. Toggle to real canisters
   Edit `apps/web/.env.demo` → set `NEXT_PUBLIC_USE_MOCKS=false` and provide canister IDs.
   Restart dev server.
