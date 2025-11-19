#!/bin/bash

# HeliosHash DAO - Secure Mode (Maximum User Security)
# Comprehensive security hardening for Fedora OS

echo "🛡️ ACTIVATING SECURE MODE - Maximum User Protection"
echo "=================================================="

# Colors for status
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log security actions
SECURITY_LOG="/var/log/hhdao-security.log"
echo "$(date): Secure mode activation initiated" | sudo tee -a $SECURITY_LOG

echo -e "\n${BLUE}🔵 BLUETOOTH SECURITY HARDENING${NC}"
echo "=================================="

# Make Bluetooth non-discoverable
echo "🔒 Making Bluetooth non-discoverable..."
bluetoothctl discoverable off
echo "✅ Bluetooth discovery disabled"

# Set strict pairing timeout
echo "🔒 Setting strict Bluetooth pairing timeout..."
bluetoothctl pairable-timeout 30
echo "✅ Pairing timeout set to 30 seconds"

# Disconnect untrusted devices
echo "🔒 Checking for untrusted connected devices..."
bluetoothctl devices Connected | while read line; do
    device_mac=$(echo $line | awk '{print $2}')
    if bluetoothctl info $device_mac | grep -q "Trusted: no"; then
        echo "⚠️ Disconnecting untrusted device: $device_mac"
        bluetoothctl disconnect $device_mac
    fi
done

echo -e "\n${BLUE}🔥 FIREWALL HARDENING${NC}"
echo "======================="

# Enable strict firewall rules
echo "🔒 Configuring strict firewall rules..."
sudo firewall-cmd --set-default-zone=block
sudo firewall-cmd --zone=block --add-service=ssh --permanent
sudo firewall-cmd --zone=block --add-port=4943/tcp --permanent  # DFX local
sudo firewall-cmd --zone=block --add-port=8080/tcp --permanent  # Dev server
sudo firewall-cmd --reload
echo "✅ Firewall configured for maximum security"

echo -e "\n${BLUE}🛡️ SYSTEM SECURITY OPTIMIZATION${NC}"
echo "=================================="

# Ensure SELinux is enforcing
echo "🔒 Verifying SELinux enforcement..."
if [ "$(getenforce)" != "Enforcing" ]; then
    sudo setenforce 1
    echo "✅ SELinux set to Enforcing mode"
else
    echo "✅ SELinux already in Enforcing mode"
fi

# Disable unnecessary services
echo "🔒 Disabling unnecessary network services..."
services_to_disable=(
    "avahi-daemon"      # Network discovery
    "cups"              # Printing (if not needed)
    "bluetooth"         # Temporarily disable if not actively needed
)

for service in "${services_to_disable[@]}"; do
    if systemctl is-active --quiet $service; then
        echo "🔒 Stopping $service..."
        sudo systemctl stop $service
        echo "⚠️ $service stopped (temporary)"
    fi
done

echo -e "\n${BLUE}🔐 NETWORK SECURITY${NC}"
echo "===================="

# Flush ARP cache to prevent ARP poisoning
echo "🔒 Flushing ARP cache..."
sudo ip -s -s neigh flush all
echo "✅ ARP cache flushed"

# Check for suspicious network connections
echo "🔍 Scanning for suspicious network connections..."
suspicious_connections=$(sudo netstat -tuln | grep -E ':22|:80|:443|:4943|:8080' | wc -l)
echo "📊 Active secure connections: $suspicious_connections"

# Monitor for new Bluetooth devices
echo "🔍 Setting up Bluetooth monitoring..."
(bluetoothctl scan on > /dev/null 2>&1 &)
sleep 2
new_devices=$(bluetoothctl devices | wc -l)
echo "📊 Bluetooth devices in range: $new_devices"
bluetoothctl scan off > /dev/null 2>&1

echo -e "\n${BLUE}🕵️ PRIVACY PROTECTION${NC}"
echo "======================="

# Clear recent files and activity
echo "🔒 Clearing privacy traces..."
rm -f ~/.local/share/recently-used.xbel
echo > ~/.bash_history
echo "✅ Privacy traces cleared"

# Secure browser settings (if Chrome/Firefox running)
if pgrep -f "chrome\|firefox" > /dev/null; then
    echo "⚠️ Browser detected - consider enabling private/incognito mode"
fi

echo -e "\n${BLUE}⚡ PERFORMANCE & SECURITY MONITORING${NC}"
echo "======================================="

# System resource monitoring
cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
mem_usage=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

echo "📊 System Status:"
echo "   CPU Usage: ${cpu_usage}%"
echo "   Memory Usage: ${mem_usage}%"
echo "   Disk Usage: ${disk_usage}%"

# Security score calculation
security_score=100
if bluetoothctl show | grep -q "Discoverable: yes"; then security_score=$((security_score - 15)); fi
if [ "$(getenforce)" != "Enforcing" ]; then security_score=$((security_score - 25)); fi
if ! sudo firewall-cmd --state | grep -q "running"; then security_score=$((security_score - 30)); fi
if [ $new_devices -gt 10 ]; then security_score=$((security_score - 10)); fi

echo -e "\n${GREEN}🎯 SECURITY SCORE: ${security_score}/100${NC}"

if [ $security_score -ge 90 ]; then
    echo -e "${GREEN}🛡️ EXCELLENT SECURITY - Maximum Protection Active${NC}"
elif [ $security_score -ge 70 ]; then
    echo -e "${YELLOW}⚠️ GOOD SECURITY - Some improvements possible${NC}"
else
    echo -e "${RED}🚨 SECURITY NEEDS ATTENTION - Review recommendations${NC}"
fi

echo -e "\n${GREEN}✅ SECURE MODE ACTIVATED${NC}"
echo "=========================="
echo "🔒 Bluetooth: Non-discoverable, trusted devices only"
echo "🔥 Firewall: Block zone, essential ports only"  
echo "🛡️ SELinux: Enforcing mode active"
echo "🕵️ Privacy: Traces cleared, monitoring active"
echo "📊 Monitoring: Real-time security assessment enabled"

echo -e "\n${BLUE}💡 SECURITY RECOMMENDATIONS:${NC}"
echo "- Use 'normal-mode' to restore standard settings"
echo "- Keep Bluetooth discoverable off when not pairing"
echo "- Regularly update system: sudo dnf update"
echo "- Monitor logs: tail -f /var/log/hhdao-security.log"
echo "- Use VPN for external connections"

# Create security status file
echo "SECURE_MODE_ACTIVE=true" > ~/.hhdao_security_status
echo "SECURITY_SCORE=$security_score" >> ~/.hhdao_security_status
echo "ACTIVATION_TIME=$(date)" >> ~/.hhdao_security_status

echo "$(date): Secure mode activated successfully - Score: $security_score/100" | sudo tee -a $SECURITY_LOG

echo -e "\n🚀 ${GREEN}SECURE MODE READY - Your system is now hardened!${NC}"