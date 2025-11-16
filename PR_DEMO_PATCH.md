# Demo/mocking bootstrap — changes summary

This patch scaffolds a local demo-mode for the HeliosHash web app so developers can run the frontend without the full ICP canister backend.

What I added

- `mock-api/` — small Express server with demo endpoints and a well-known DevTools probe route.
- `apps/web/src/mocks/` — MSW `handlers.ts` and `browser.ts` to start a client-side worker when demo mode is enabled.
- `.env.demo` — example environment variables to enable demo mode and point to the mock API at `http://localhost:4000`.
- `mock-api/package.json` and `mock-api/README.md`.
- `PR_DEMO_PATCH.md` — this file.

Notes

- To run locally:
  1. Start mock API: `cd mock-api && npm install && npm start`
  2. Start the web app with demo env: `NEXT_PUBLIC_APP_MODE=demo NEXT_PUBLIC_MOCK_API=http://localhost:4000 pnpm dev -p 3002`

- MSW will start in the browser when `NEXT_PUBLIC_APP_MODE=demo` and the client `useMockWorker()` hook is mounted.
