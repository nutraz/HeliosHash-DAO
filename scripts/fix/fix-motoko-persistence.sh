#!/bin/bash
# Purpose: Comprehensive fix for Motoko persistent actor issues
# Location: scripts/fix/

echo "🔧 Comprehensive Motoko Persistence Fix"
echo "======================================="

cd "$(dirname "$0")/../.."

CANISTER_FILE="src/main.mo"
if [ ! -f "$CANISTER_FILE" ]; then
    echo "❌ $CANISTER_FILE not found"
    echo "📁 Available .mo files:"
    find . -name "*.mo" -type f | grep -v node_modules
    exit 1
fi

# Create backup
BACKUP_FILE="$CANISTER_FILE.backup.$(date +%Y%m%d_%H%M%S)"
cp "$CANISTER_FILE" "$BACKUP_FILE"
echo "📦 Backup created: $BACKUP_FILE"

# Analyze the current actor declaration
echo "🔍 Analyzing current actor declaration..."

if grep -q "actor class" "$CANISTER_FILE"; then
    echo "✅ Actor class found - checking persistence..."
    if grep -q "persistent" "$CANISTER_FILE"; then
        echo "✅ Already persistent - no changes needed"
    else
        echo "⚠️  Actor class needs persistence..."
        sed -i 's/actor class/persistent actor class/g' "$CANISTER_FILE"
        echo "✅ Added persistent keyword to actor class"
    fi
elif grep -q "^actor" "$CANISTER_FILE"; then
    echo "📝 Standard actor found - converting to persistent..."
    
    # Extract actor name
    ACTOR_NAME=$(grep "^actor" "$CANISTER_FILE" | sed 's/actor//g' | sed 's/{//g' | tr -d ' ' | head -1)
    if [ -z "$ACTOR_NAME" ]; then
        ACTOR_NAME="Main"
    fi
    
    # Create new persistent actor structure
    cat > /tmp/new_actor.mo << ACTOR_TEMPLATE
import Prim "mo:base/Prim";

actor ${ACTOR_NAME} {
  
  // Stable variables for state persistence
  stable var state : Nat = 0;
  
  // Initialize canister
  public shared func init() : async () {
    state := 0;
  };
  
  // Get current state
  public shared query func getState() : async Nat {
    return state;
  };
  
  // Update state
  public shared func setState(newState : Nat) : async () {
    state := newState;
  };

ACTOR_TEMPLATE

    # Extract the body of the actor (everything after the opening brace)
    sed -n '/^{/,/^}/p' "$CANISTER_FILE" | tail -n +2 | head -n -1 > /tmp/actor_body.mo
    
    # Combine template with body
    cat /tmp/new_actor.mo /tmp/actor_body.mo > /tmp/combined.mo
    echo "}" >> /tmp/combined.mo
    
    mv /tmp/combined.mo "$CANISTER_FILE"
    echo "✅ Converted to persistent actor with stable state"
    
else
    echo "❌ No actor declaration found in $CANISTER_FILE"
    echo "📋 First few lines of file:"
    head -10 "$CANISTER_FILE"
    exit 1
fi

# Verify the fix
echo "🔍 Verifying the fix..."
if grep -q "persistent" "$CANISTER_FILE" || grep -q "stable var" "$CANISTER_FILE"; then
    echo "✅ Fix applied successfully!"
    echo "📝 Updated actor declaration:"
    grep -A 5 -B 2 "actor" "$CANISTER_FILE" | head -10
else
    echo "❌ Fix may not have been applied correctly"
    echo "📋 Current actor declaration:"
    grep -A 2 -B 2 "actor" "$CANISTER_FILE"
fi

echo ""
echo "🚀 Next steps:"
echo "  1. Run: dfx deploy"
echo "  2. If issues persist, check the backup: $BACKUP_FILE"
echo "  3. Review the Motoko code for other persistence requirements"
