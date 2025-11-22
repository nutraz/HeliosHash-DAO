#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🌞 Starting HeliosHash-DAO dev environment..."

# 1️⃣ Initialize & install mops in all canisters
CANISTERS_DIR="$DIR/../canisters"
for canister in "$CANISTERS_DIR"/*/; do
    if [ -d "$canister" ]; then
        cd "$canister"
        if [ ! -f "mops.toml" ]; then
            echo "✨ Initializing mops in $(basename $canister)"
            yes | mops init
        fi
        echo "📦 Installing mops dependencies in $(basename $canister)"
        mops install
        cd - > /dev/null
    fi
done

# 2️⃣ Build & deploy Motoko canisters
echo "🚀 Building and deploying canisters..."
cd "$CANISTERS_DIR"
dfx start --clean & sleep 5
dfx deploy
cd - > /dev/null

# 3️⃣ Start Node.js API
echo "🔌 Starting Node.js API..."
cd "$DIR/../api" && pnpm dev &
cd - > /dev/null

# 4️⃣ Start Next.js Web app
echo "🌐 Starting Next.js Web..."
cd "$DIR/../web" && pnpm dev &
cd - > /dev/null

# 5️⃣ Start Flutter Mobile app
echo "📱 Starting Flutter Mobile..."
cd "$DIR/../mobile" && flutter run &
cd - > /dev/null

# 6️⃣ Wait for all background processes
wait
