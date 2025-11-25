#!/usr/bin/env bash
# HeliosHash DAO Podman Dev Launcher (FINAL PATCHED VERSION)
# Save as: start-hhdao-dev-podman.sh
# chmod +x start-hhdao-dev-podman.sh

set -euo pipefail
IFS=$'\n\t'

CONTAINER_NAME="hhdao-dev"
IMAGE="ubuntu:22.04"
HOST_WORKDIR="$HOME/HeliosHash-DAO"
CONTAINER_WORKDIR="/workspace"

DFX_PORT=4943
ALT_PORT=4944

info(){ echo -e "\e[34mℹ\e[0m $1"; }
ok(){ echo -e "\e[32m✔\e[0m $1"; }
warn(){ echo -e "\e[33m⚠\e[0m $1"; }
err(){ echo -e "\e[31m✖\e[0m $1"; }

echo "=============================================="
echo "  HeliosHash DAO Podman Dev Launcher"
echo "=============================================="
echo
echo "1) Backend (DFX)"
echo "2) Frontend (Next.js)"
echo "3) Both"
echo
read -p "Choose [1/2/3]: " choice

# Remove old container
if podman ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  warn "Removing old container..."
  podman rm -f $CONTAINER_NAME >/dev/null 2>&1 || true
fi

# Auto-port
if sudo lsof -i:$DFX_PORT >/dev/null 2>&1; then
  warn "Port $DFX_PORT busy → switching to $ALT_PORT"
  DFX_PORT=$ALT_PORT
fi

info "Starting container..."
podman run -d --name "$CONTAINER_NAME" \
  --network host \
  --ipc host \
  -v "$HOST_WORKDIR:$CONTAINER_WORKDIR:Z" \
  -w "$CONTAINER_WORKDIR" \
  --entrypoint tail \
  "$IMAGE" -f /dev/null

ok "Container started."

# Install apt stuff
podman exec -u root "$CONTAINER_NAME" bash -lc \
  "apt-get update -y && apt-get install -y curl ca-certificates gnupg2 build-essential lsb-release"

# Install Node + pnpm
if ! podman exec "$CONTAINER_NAME" bash -lc "which pnpm" >/dev/null 2>&1; then
  warn "Installing Node 20 & pnpm..."
  podman exec -u root "$CONTAINER_NAME" bash -lc \
    "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -"
  podman exec -u root "$CONTAINER_NAME" bash -lc \
    "apt-get install -y nodejs"
  podman exec -u root "$CONTAINER_NAME" bash -lc \
    "npm install -g pnpm"
fi

# Install DFX (non-interactive)
if ! podman exec "$CONTAINER_NAME" bash -lc "which dfx" >/dev/null 2>&1; then
  warn "Installing DFX (non-interactive)..."
  podman exec -u root "$CONTAINER_NAME" bash -lc \
    "DFXVM_INIT_SKIP_PROMPT=yes DFX_VERSION=latest sh -ci \"\$(curl -fsSL https://sdk.dfinity.org/install.sh)\" || true"
fi

start_backend() {
  info "Starting backend…"

  podman exec -u root "$CONTAINER_NAME" bash -lc "pkill dfx || true"

  podman exec -u root -d "$CONTAINER_NAME" bash -lc \
    "source /root/.profile && dfx start --clean --background --host 127.0.0.1:$DFX_PORT || true"

  ok "DFX launched at port $DFX_PORT"

  if podman exec "$CONTAINER_NAME" test -d "$CONTAINER_WORKDIR/backend"; then
    info "Deploying canisters…"
    podman exec -u root -d "$CONTAINER_NAME" bash -lc \
      "cd backend && source /root/.profile && dfx deploy || true"
    ok "Canister deployment triggered."
  fi
}

start_frontend() {
  info "Starting frontend (Next.js)…"
  if podman exec "$CONTAINER_NAME" test -d "$CONTAINER_WORKDIR/apps/web"; then
    podman exec -u root -d "$CONTAINER_NAME" bash -lc \
      "cd apps/web && pnpm install --no-frozen-lockfile"
    podman exec -u root -d "$CONTAINER_NAME" bash -lc \
      "cd apps/web && pnpm run dev > /workspace/.web.log 2>&1"
    ok "Frontend running → http://localhost:3002"
  else
    warn "apps/web missing."
  fi
}

open_vscode() {
  if command -v code >/dev/null 2>&1; then
    info "Opening VS Code…"
    code -n "$HOST_WORKDIR/backend" || true
    code -n "$HOST_WORKDIR/apps/web" || true
  fi
}

case "$choice" in
  1) start_backend; open_vscode ;;
  2) start_frontend; open_vscode ;;
  3) start_backend; sleep 2; start_frontend; open_vscode ;;
  *) err "Invalid choice"; exit 1 ;;
esac

ok "Environment ready."

