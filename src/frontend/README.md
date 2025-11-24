Deploying frontend as an ICP asset canister (local replica)
=========================================================

This folder is the target for static assets served by the `frontend` asset canister defined in `dfx.json`.

Quick steps to deploy locally (assumes `dfx` is installed and available on PATH):

1) Start local dfx replica (clean):

```bash
dfx stop || true
dfx start --background --clean
```

2) Build, export and deploy the web canister (from repo root):

```bash
./scripts/deploy-web-canister.sh
```

3) Open the deployed frontend in your browser:

```bash
CANISTER_ID=$(dfx canister id frontend)
echo "http://$CANISTER_ID.localhost:8000/"
# or open directly:
# xdg-open "http://$CANISTER_ID.localhost:8000/"
```

Notes:
- `next export` is used to generate static assets. Your app must be compatible with static export (no server-only routes or APIs).
- If your app requires dynamic server integration, consider building a small static wrapper or using a lightweight static SPA build instead.
- For Internet Identity flows, ensure the frontend is configured to use the local replica host (e.g. `NEXT_PUBLIC_IC_HOST=http://localhost:8000`) before building.
