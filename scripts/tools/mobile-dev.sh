#!/usr/bin/env bash
set -euo pipefail

echo "🌞 HeliosHash Mobile Dev Launcher"
echo "────────────────────────────────────────"

BASE_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$BASE_DIR"

PREFERRED_PORT="3005"
FALLBACK_PORT="3001"

pick_port() {
  for p in "$PREFERRED_PORT" "$FALLBACK_PORT"; do
    if ! lsof -i:"$p" >/dev/null 2>&1; then
      echo "$p"; return 0;
    fi
  done
  # last resort random high port
  for p in $(seq 3100 3120); do
    if ! lsof -i:"$p" >/dev/null 2>&1; then echo "$p"; return 0; fi
  done
  echo "No free port found" >&2; exit 1
}

PORT=$(pick_port)
LAN_IP=$(ip route get 8.8.8.8 2>/dev/null | grep -oP 'src \K[0-9.]+' | head -1 || echo "")

echo "📡 Selected Port: $PORT"
echo "📱 LAN IP:        ${LAN_IP:-not-detected}" 

echo "🔥 Ensuring firewall rule (may require sudo)…"
if command -v firewall-cmd >/dev/null 2>&1; then
  sudo firewall-cmd --add-port=${PORT}/tcp --permanent >/dev/null 2>&1 || true
  sudo firewall-cmd --reload >/dev/null 2>&1 || true
fi

echo "🧹 Cleaning old processes"
pkill -f "tsx server.ts" 2>/dev/null || true

echo "🚀 Starting server"
NODE_ENV=development PORT=$PORT HOSTNAME=0.0.0.0 npx tsx server.ts &
SERVER_PID=$!

echo "⏳ Waiting for readiness..."
for i in {1..20}; do
  sleep 1
  if curl -fsS "http://localhost:${PORT}/api/status" >/dev/null 2>&1; then
    READY=1; break
  fi
  printf '.'
done
echo ""

if [[ "${READY:-0}" -ne 1 ]]; then
  echo "❌ Server failed to become ready"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

APP_URL_LOCAL="http://localhost:${PORT}"
APP_URL_LAN="${LAN_IP:+http://$LAN_IP:${PORT}}"

echo "✅ Server Ready"
echo "   Local:   ${APP_URL_LOCAL}"
if [[ -n "$APP_URL_LAN" ]]; then
  echo "   Network: ${APP_URL_LAN}" 
fi

if grep -q 'qrcode' package.json 2>/dev/null; then
  if node -e "require('qrcode')" 2>/dev/null; then
    TARGET_URL="${APP_URL_LAN:-$APP_URL_LOCAL}/auth/login"
    echo "🧾 QR for: $TARGET_URL"
    TARGET_URL="$TARGET_URL" node - <<'NODE'
const QRCode = require('qrcode');
const target = process.env.TARGET_URL;
if (!target) {
  console.error('TARGET_URL not provided');
  process.exit(1);
}
 audit-clean
QRCode.toString(target, { type: 'terminal', small: true }, (e, out) => {
  if (e) return console.error('QR error', e);
  console.log(out);
  console.log('\nScan to open login page.');
});
NODE
  else
    echo "(Install qrcode for terminal QR: pnpm add qrcode)"
  fi
else
  echo "(Add qrcode dependency for QR generation)"
fi

echo "📊 Live tail (Ctrl+C to stop, process continues)"
tail -n 20 -f dev.log &
TAIL_PID=$!

trap 'echo "\n⏹ Stopping..."; kill $SERVER_PID $TAIL_PID 2>/dev/null || true; exit 0' INT TERM

wait $SERVER_PID || true