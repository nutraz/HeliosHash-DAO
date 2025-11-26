#!/usr/bin/env bash
# HeliosHash-DAO: Unified Auto Build & Dev Script
set -e

# Resolve script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 1️⃣ Motoko canisters: mops init/install if needed, build & deploy
cd "$DIR/../canisters"
if [ ! -f "mops.toml" ]; then
  echo "Initializing mops..."
  mops init
fi
mops install
dfx build
dfx deploy

# 2️⃣ Node.js API (dev)
cd "$DIR/../api" && pnpm dev &

# 3️⃣ Next.js web app (dev)
cd "$DIR/../web" && pnpm dev &

# 4️⃣ Flutter mobile app (dev)
cd "$DIR/../mobile" && flutter run &

wait
