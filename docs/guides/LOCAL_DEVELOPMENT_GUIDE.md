# Local Development Guide

## Frontend Access After Deployment

After successfully deploying canisters with `dfx deploy`, you'll see output like:

```text
URLs:
  Frontend canister via browser:
    hhdao_frontend:
      - http://vizcg-th777-77774-qaaea-cai.localhost:8000/ (Recommended)
      - http://127.0.0.1:8000/?canisterId=vizcg-th777-77774-qaaea-cai (Legacy)
```

### ✅ Working URL (Use This)

On Fedora/Linux, use the **Legacy URL format**:

```text
http://127.0.0.1:8000/?canisterId=vizcg-th777-77774-qaaea-cai
```

This always works because it uses the IP address directly.

### ❌ Why .localhost URLs Don't Work

The "Recommended" URL `http://<canister-id>.localhost:8000/` fails on Linux because:

1. Linux doesn't automatically resolve `*.localhost` to `127.0.0.1`
2. Wildcard DNS resolution requires system configuration

### 🔧 Shell Configuration Fix

If you see `bash: /dfx/env: No such file or directory`, it's because your shell config has:

```bash
. "$HOME/.local/share/dfx/env"
. "$XDG_DATA_HOME/dfx/env"
```

**Solution**: These lines have been commented out in your `~/.bashrc`. The `dfx` command still works from your PATH.

### 🚀 Development Workflow

1. Start local IC replica: `dfx start --clean --background`
2. Deploy canisters: `dfx deploy`
3. Use the Legacy URL format to access your frontend
4. Run Playwright E2E tests: `pnpm exec playwright test`

### 📱 Mobile Testing

For mobile testing, the dev server runs on port 3001:

```bash
pnpm dev  # Starts on http://localhost:3001
```
### 🧪 Playwright Configuration

Playwright tests are configured to use `localhost:3001` (dev server), not the canister URLs. This allows testing without requiring full canister deployment.

## Quick Reference

| Purpose | URL |
|---------|-----|
| IC Frontend (after deploy) | `http://127.0.0.1:8000/?canisterId=<canister-id>` |
| Dev Server (for testing) | `http://localhost:3001` |
| Mobile Dev Server | `http://0.0.0.0:3001` (accessible on network) |
