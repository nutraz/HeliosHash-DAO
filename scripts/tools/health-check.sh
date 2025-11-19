#!/usr/bin/env bash
set -euo pipefail

PORT=${PORT:-3001}
ENDPOINT="http://localhost:$PORT/api/status"

echo "🔍 Checking HeliosHash DAO health on port $PORT..."

# Check listener
if ! ss -tlnp 2>/dev/null | grep -q ":$PORT "; then
  echo "❌ Port $PORT is not listening"
  echo "   Start server: pnpm dev"; exit 1;
fi

# Fetch JSON (retry a couple times in case of race)
ATTEMPTS=3
for i in $(seq 1 $ATTEMPTS); do
  RESP=$(curl -s --max-time 3 "$ENDPOINT" || true)
  if [[ -n "$RESP" ]]; then break; fi
  sleep 1
done

if [[ -z "${RESP}" ]]; then
  echo "❌ No response from $ENDPOINT"; exit 1;
fi

STATUS=$(echo "$RESP" | jq -r '.status // .replica.status // empty' 2>/dev/null || true)
MESSAGE=$(echo "$RESP" | jq -r '.message // empty' 2>/dev/null || true)
PORT_FIELD=$(echo "$RESP" | jq -r '.port // empty' 2>/dev/null || true)
IP_FIELD=$(echo "$RESP" | jq -r '.ip // empty' 2>/dev/null || true)
UPTIME=$(echo "$RESP" | jq -r '.uptime // empty' 2>/dev/null || true)

<<<<<<< HEAD
if [[ "$STATUS" != "ok" && "$STATUS" != "up" && "$STATUS" != "healthy" ]]; then
=======
if [[ "$STATUS" != "ok" && "$STATUS" != "up" && "$STATUS" != "healthy" ]]; then
>>>>>>> audit-clean
  echo "❌ API status not OK (status=$STATUS)"
  echo "Raw response:"
  echo "$RESP" | jq '.' 2>/dev/null || echo "$RESP"
  exit 1
fi

echo "✅ HeliosHash DAO is healthy"
[[ -n "$MESSAGE" ]] && echo "🖥  Message: $MESSAGE"
[[ -n "$PORT_FIELD" ]] && echo "⚡ Port:    $PORT_FIELD"
[[ -n "$IP_FIELD" ]] && echo "🌐 IP:      $IP_FIELD"
[[ -n "$UPTIME" ]] && echo "⏱  Uptime:  $UPTIME"
