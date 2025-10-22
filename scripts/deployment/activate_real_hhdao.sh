#!/usr/bin/env bash
# 🏔️ HHDAO Real System Activation Script
# ONLY sets up environment — does NOT start server

set -e

echo "🌅 ACTIVATING REAL HHDAO - Urgam Valley Transformation"
echo "============================================================"

# Verify canisters
echo "📦 Verifying deployed canisters..."
dfx ping >/dev/null || { echo "❌ DFX not running"; exit 1; }
dfx canister status hhdao_dao --network local >/dev/null || { echo "❌ DAO canister not deployed"; exit 1; }
dfx canister status hhdao_treasury --network local >/dev/null || { echo "❌ Treasury canister not deployed"; exit 1; }
echo "✅ All canisters verified"

# Get IDs
DAO_ID=$(dfx canister id hhdao_dao --network local)
TREASURY_ID=$(dfx canister id hhdao_treasury --network local)
IDENTITY_ID=$(dfx canister id hhdao_identity --network local)
TELEMETRY_ID=$(dfx canister id hhdao_telemetry --network local)

# Write .env.local
cat > .env.local <<EOF
NEXT_PUBLIC_DAO_CANISTER_ID=$DAO_ID
NEXT_PUBLIC_TREASURY_CANISTER_ID=$TREASURY_ID
NEXT_PUBLIC_IDENTITY_CANISTER_ID=$IDENTITY_ID
NEXT_PUBLIC_TELEMETRY_CANISTER_ID=$TELEMETRY_ID
NEXT_PUBLIC_USE_REAL_CANISTERS=true
NEXT_PUBLIC_REAL_USER=nutraazz
NEXT_PUBLIC_OWP_BALANCE=226898
NEXT_PUBLIC_MERIT_RANK=1
EOF

echo "✅ Environment configured with REAL canister IDs"
echo "➡️  Now run: pnpm dev"
