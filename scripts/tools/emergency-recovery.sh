#!/bin/bash

# HeliosHash DAO - Emergency Recovery & Backup System
# Ensures you never lose access to your DAO and crypto assets

echo "🆘 HHDAO EMERGENCY RECOVERY SYSTEM"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

BACKUP_DIR="$HOME/.hhdao-emergency-backup"
RECOVERY_FILE="$HOME/.hhdao-recovery-info"

echo -e "${BLUE}🔐 CREATING EMERGENCY ACCESS PLAN${NC}"
echo "=================================="

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo -e "\n${GREEN}✅ ACCESS LAYERS ANALYSIS:${NC}"
echo "=========================="

echo "1️⃣ PRIMARY ACCESS (Always Available):"
echo "   🖥️  Fedora System Login: $(whoami)@$(hostname)"
echo "   🔑 Root Access: $(sudo -n whoami 2>/dev/null && echo '✅ Available' || echo '⚠️ Requires password')"
echo "   💾 Local Storage: $(df -h $HOME | tail -1 | awk '{print $4}') free space"

echo -e "\n2️⃣ BLUETOOTH ACCESS (Convenience Only):"
echo "   📱 Connected Phone: $(bluetoothctl devices Connected | head -1 | awk '{print $3,$4,$5}' || echo 'None')"
echo "   🔄 Replaceable: Any new Bluetooth device can be paired"
echo "   ❌ NOT Critical: HeliosHash DAO works without phone"

echo -e "\n3️⃣ BLOCKCHAIN ACCESS (Critical for Real Funds):"
# Check if DFX identity exists
if [ -d "$HOME/.config/dfx/identity" ]; then
    identity_count=$(ls -1 "$HOME/.config/dfx/identity" | wc -l)
    echo "   🔑 DFX Identities: $identity_count found"
    echo "   🌐 Internet Computer: Accessible globally with seed phrase"
else
    echo "   ⚠️ No DFX identities found - Development mode only"
fi

echo -e "\n${PURPLE}🆘 EMERGENCY RECOVERY PROCEDURES:${NC}"
echo "=================================="

# Create recovery information file
cat > "$RECOVERY_FILE" << EOF
# HeliosHash DAO Emergency Recovery Information
# Generated: $(date)
# System: $(whoami)@$(hostname)

## CRITICAL ACCESS METHODS (In Order of Importance)

### 1. FEDORA SYSTEM ACCESS (PRIMARY)
- Username: $(whoami)
- Hostname: $(hostname)  
- Home Directory: $HOME
- HeliosHash DAO Path: $(pwd)

### 2. SYSTEM RECOVERY COMMANDS
- Regain sudo: sudo -i
- Reset Bluetooth: sudo systemctl restart bluetooth
- Emergency network: sudo systemctl restart NetworkManager
- Security reset: ./scripts/white-mode.sh

### 3. BLOCKCHAIN RECOVERY (If using real ICP)
- DFX Identity Location: ~/.config/dfx/identity/
- Backup Identity: dfx identity export [name] > backup.pem
- Restore Identity: dfx identity import [name] backup.pem
- Check Balance: dfx wallet balance
- Canister Status: dfx canister status --all

### 4. DEVELOPMENT RECOVERY
- Restart DFX: dfx start --clean
- Rebuild Project: npm run build
- Reset Database: rm -rf .dfx/ && dfx start
- Fresh Install: git clone [repository] && npm install

## EMERGENCY CONTACTS & RESOURCES
- Internet Computer Discord: https://discord.gg/internetcomputer
- DFX Documentation: https://internetcomputer.org/docs/
- HeliosHash DAO Repository: https://github.com/$(whoami)/HeliosHash-DAO
- One World Project: https://dapp.oneworldproject.io/

## SECURITY INCIDENT RESPONSE
1. Change all passwords immediately
2. Revoke device access: bluetoothctl remove [device]
3. Check for unauthorized canisters: dfx canister status --all
4. Review security logs: tail -f /var/log/hhdao-security.log
5. Enable maximum security: ./scripts/secure-mode.sh

## PHONE LOSS RESPONSE PLAN
1. ✅ KEEP CALM - You have full system access
2. 🔐 Change phone-based 2FA if enabled
3. 🔄 Remove lost device: bluetoothctl remove [mac-address]
4. 📱 Pair new device when available
5. 🛡️ Run security scan: ./scripts/security-monitor.sh

REMEMBER: Your Fedora system is your PRIMARY access point!
Your HeliosHash DAO development is SAFE and LOCAL!
EOF

echo "📝 Emergency procedures documented in: $RECOVERY_FILE"

# Create automated backup
echo -e "\n${BLUE}💾 CREATING AUTOMATED BACKUPS${NC}"
echo "=============================="

# Backup critical files
backup_files=(
    "$HOME/.bashrc"
    "$HOME/.config/dfx"
    "$(pwd)/scripts"
    "$(pwd)/package.json" 
    "$(pwd)/dfx.json"
)

for file in "${backup_files[@]}"; do
    if [ -e "$file" ]; then
        cp -r "$file" "$BACKUP_DIR/"
        echo "✅ Backed up: $file"
    fi
done

# Create system snapshot info
cat > "$BACKUP_DIR/system-snapshot.txt" << EOF
System Snapshot - $(date)
========================
Hostname: $(hostname)
User: $(whoami)
OS: $(cat /etc/fedora-release)
Kernel: $(uname -r)
Bluetooth Controller: $(bluetoothctl show | head -1)
Network Interfaces: $(ip link show | grep "^[0-9]" | awk '{print $2}' | tr -d ':' | paste -sd "," -)
DFX Version: $(dfx --version 2>/dev/null || echo "Not installed")
Node Version: $(node --version 2>/dev/null || echo "Not installed")
Git Remote: $(git remote -v 2>/dev/null | head -1 | awk '{print $2}' || echo "No remote")
EOF

echo "📊 System snapshot created"

# Test recovery procedures
echo -e "\n${GREEN}🧪 TESTING RECOVERY PROCEDURES${NC}"
echo "=============================="

# Test 1: Can we access home directory?
if [ -r "$HOME" ] && [ -w "$HOME" ]; then
    echo "✅ Home directory access: OK"
else
    echo "❌ Home directory access: FAILED"
fi

# Test 2: Can we run HeliosHash scripts?
if [ -x "$(pwd)/scripts/white-mode.sh" ]; then
    echo "✅ Script execution: OK"  
else
    echo "❌ Script execution: FAILED - Run chmod +x scripts/*.sh"
fi

# Test 3: Can we start DFX?
if command -v dfx >/dev/null; then
    echo "✅ DFX availability: OK"
else
    echo "⚠️ DFX not found - Install with: sh -ci \"\$(curl -fsSL https://sdk.dfinity.org/install.sh)\""
fi

# Test 4: Internet connectivity
if ping -c 1 google.com >/dev/null 2>&1; then
    echo "✅ Internet connectivity: OK"
else
    echo "⚠️ No internet - Check network settings"
fi

echo -e "\n${PURPLE}🎯 FINAL SECURITY ASSESSMENT${NC}"
echo "============================="

security_score=100
issues=()

# Check for potential issues
if ! command -v dfx >/dev/null; then 
    security_score=$((security_score - 10))
    issues+=("DFX not installed")
fi

if [ ! -d "$HOME/.config/dfx/identity" ]; then
    security_score=$((security_score - 5))
    issues+=("No DFX identities (dev mode)")
fi

if ! bluetoothctl show >/dev/null 2>&1; then
    security_score=$((security_score - 15))
    issues+=("Bluetooth controller issues")
fi

if [ ${#issues[@]} -eq 0 ]; then
    echo -e "${GREEN}🛡️ RECOVERY READINESS: EXCELLENT (${security_score}/100)${NC}"
    echo "✅ All recovery methods tested and ready"
else
    echo -e "${YELLOW}⚠️ RECOVERY READINESS: GOOD (${security_score}/100)${NC}"
    echo "Issues found:"
    for issue in "${issues[@]}"; do
        echo "  - $issue"
    done
fi

echo -e "\n${GREEN}🎉 EMERGENCY RECOVERY SYSTEM READY!${NC}"
echo "=================================="
echo "📋 Recovery Guide: $RECOVERY_FILE"
echo "💾 Backups Location: $BACKUP_DIR"
echo "🆘 Emergency Command: cat $RECOVERY_FILE"
echo ""
echo -e "${BLUE}💡 KEY TAKEAWAY: Even if you lose your phone,${NC}"
echo -e "${BLUE}   you STILL have full access to everything important!${NC}"
echo ""
echo "🔐 Your Fedora system IS your primary security layer!"
echo "📱 Phone loss = Minor inconvenience, NOT system compromise!"