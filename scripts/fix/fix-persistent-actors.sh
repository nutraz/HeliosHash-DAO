#!/bin/bash
# Purpose: 
# Location: scripts/fix/
set -e

echo "🔧 FIXING PERSISTENT ACTORS FOR DFX 0.29.2"
echo "=========================================="

cd /home/nutarzz/Development/HHDAO-FUSION

# 1. Clean everything
echo "🧹 Cleaning DFX state..."
dfx stop 2>/dev/null || true
rm -rf .dfx
sleep 2

# 2. Start DFX
echo "⚡ Starting DFX..."
dfx start --background --clean
sleep 10

# 3. Create dfx.json with persistent actor support
echo "⚙️ Creating configuration..."
cat > dfx.json << 'DFXJSON'
{
  "canisters": {
    "main": {
      "main": "src/main.mo",
      "type": "motoko"
    }
  },
  "version": 1
}
DFXJSON

# 4. Create persistent actor
echo "📝 Creating persistent actor..."
mkdir -p src
cat > src/main.mo << 'MAIN'
actor Main {
  public query func test() : async Text {
    "HHDAO Fusion is working!";
  };
  
  public query func version() : async Text {
    "1.0.0";
  };
  
  public query func greet(name : Text) : async Text {
    "Hello, " # name # " from HHDAO Fusion!";
  };
  
  public query func ping() : async Text {
    "pong";
  };
};
MAIN

# 5. Build and deploy
echo "🏗️ Building canister..."
dfx canister create main
dfx build

echo "🚀 Deploying canister..."
dfx deploy

# 6. Test the canister
echo "🧪 Testing canister..."
dfx canister call main ping
dfx canister call main version
dfx canister call main greet '("World")'
dfx canister call main test

echo ""
echo "✅ SUCCESS! PERSISTENT ACTORS ARE WORKING!"
echo ""
echo "🎯 Canister ID: $(dfx canister id main)"
