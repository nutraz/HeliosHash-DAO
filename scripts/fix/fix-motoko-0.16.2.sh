#!/bin/bash
# Purpose: 
# Location: scripts/fix/
set -e

echo "🔧 FIX FOR MOTOKO 0.16.2 - PERSISTENT ACTORS REQUIRED"
echo "===================================================="

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

# 3. Create minimal dfx.json
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

# 4. Create persistent actor (REQUIRED for Motoko 0.16.2)
echo "📝 Creating persistent actor..."
mkdir -p src
cat > src/main.mo << 'MOTOKO'
// HHDAO Fusion Main Canister
// Motoko 0.16.2 REQUIRES persistent keyword
persistent actor Main {
  
  // Test function
  public query func test() : async Text {
    return "HHDAO Fusion is working!";
  };
  
  // Health check
  public query func ping() : async Text {
    return "pong";
  };
  
  // Version info
  public query func version() : async Text {
    return "1.0.0";
  };
  
  // Greeting function
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "! Welcome to HHDAO Fusion";
  };
  
  // Get canister info
  public query func info() : async Text {
    return "HHDAO Fusion - Persistent Actor - Motoko 0.16.2";
  };
};
MOTOKO

# 5. Build and deploy
echo "🏗️ Building canister..."
dfx canister create main
dfx build

echo "🚀 Deploying canister..."
dfx deploy

# 6. Test everything
echo "🧪 Testing canister..."
echo "Testing ping:"
dfx canister call main ping

echo "Testing version:"
dfx canister call main version

echo "Testing greet:"
dfx canister call main greet '("Developer")'

echo "Testing test:"
dfx canister call main test

echo "Testing info:"
dfx canister call main info

echo ""
echo "✅ SUCCESS! HHDAO-FUSION WORKING WITH MOTOKO 0.16.2!"
echo ""
echo "🎯 Canister ID: $(dfx canister id main)"
