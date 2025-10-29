#!/bin/bash

# HeliosHash DAO - Security Monitoring System
# Real-time security monitoring and threat detection

echo "🕵️ HHDAO Security Monitor - Starting Continuous Protection"
echo "=========================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
MONITOR_INTERVAL=30  # seconds
LOG_FILE="/var/log/hhdao-security-monitor.log"
ALERT_THRESHOLD_CPU=80
ALERT_THRESHOLD_MEM=85
ALERT_THRESHOLD_BLUETOOTH_DEVICES=15

# Initialize log
echo "$(date): Security monitoring started" | sudo tee -a $LOG_FILE

# Function to check Bluetooth security
check_bluetooth_security() {
    echo -e "\n${BLUE}🔵 BLUETOOTH SECURITY SCAN${NC}"
    
    # Check if discoverable
    if bluetoothctl show | grep -q "Discoverable: yes"; then
        echo -e "${YELLOW}⚠️ WARNING: Bluetooth is discoverable${NC}"
        echo "$(date): SECURITY ALERT - Bluetooth discoverable" | sudo tee -a $LOG_FILE
    else
        echo -e "${GREEN}✅ Bluetooth not discoverable${NC}"
    fi
    
    # Count nearby devices
    device_count=$(bluetoothctl devices | wc -l)
    if [ $device_count -gt $ALERT_THRESHOLD_BLUETOOTH_DEVICES ]; then
        echo -e "${RED}🚨 ALERT: High number of Bluetooth devices detected: $device_count${NC}"
        echo "$(date): SECURITY ALERT - $device_count Bluetooth devices detected" | sudo tee -a $LOG_FILE
    else
        echo -e "${GREEN}✅ Bluetooth device count normal: $device_count${NC}"
    fi
    
    # Check for new untrusted connections
    connected_untrusted=$(bluetoothctl devices Connected | while read line; do
        device_mac=$(echo $line | awk '{print $2}')
        if [ -n "$device_mac" ] && bluetoothctl info $device_mac 2>/dev/null | grep -q "Trusted: no"; then
            echo "UNTRUSTED:$device_mac"
        fi
    done | wc -l)
    
    if [ $connected_untrusted -gt 0 ]; then
        echo -e "${RED}🚨 ALERT: $connected_untrusted untrusted device(s) connected${NC}"
        echo "$(date): SECURITY ALERT - Untrusted devices connected" | sudo tee -a $LOG_FILE
    fi
}

# Function to check system resources
check_system_resources() {
    echo -e "\n${PURPLE}⚡ SYSTEM RESOURCE MONITORING${NC}"
    
    # CPU usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}' | awk -F'us' '{print $1}')
    if (( $(echo "$cpu_usage > $ALERT_THRESHOLD_CPU" | bc -l) )); then
        echo -e "${RED}🚨 HIGH CPU USAGE: ${cpu_usage}%${NC}"
        echo "$(date): PERFORMANCE ALERT - CPU usage: ${cpu_usage}%" | sudo tee -a $LOG_FILE
    else
        echo -e "${GREEN}✅ CPU usage normal: ${cpu_usage}%${NC}"
    fi
    
    # Memory usage
    mem_usage=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
    if (( $(echo "$mem_usage > $ALERT_THRESHOLD_MEM" | bc -l) )); then
        echo -e "${RED}🚨 HIGH MEMORY USAGE: ${mem_usage}%${NC}"
        echo "$(date): PERFORMANCE ALERT - Memory usage: ${mem_usage}%" | sudo tee -a $LOG_FILE
    else
        echo -e "${GREEN}✅ Memory usage normal: ${mem_usage}%${NC}"
    fi
}

# Function to check network security
check_network_security() {
    echo -e "\n${BLUE}🌐 NETWORK SECURITY SCAN${NC}"
    
    # Check firewall status
    if ! sudo firewall-cmd --state | grep -q "running"; then
        echo -e "${RED}🚨 CRITICAL: Firewall is not running!${NC}"
        echo "$(date): CRITICAL ALERT - Firewall down" | sudo tee -a $LOG_FILE
    else
        echo -e "${GREEN}✅ Firewall active${NC}"
    fi
    
    # Check for suspicious listening ports
    suspicious_ports=$(sudo netstat -tuln | grep LISTEN | grep -v -E ':22|:4943|:8080|:53|:25|:631' | wc -l)
    if [ $suspicious_ports -gt 0 ]; then
        echo -e "${YELLOW}⚠️ WARNING: $suspicious_ports non-standard listening ports detected${NC}"
        echo "$(date): SECURITY WARNING - Suspicious listening ports: $suspicious_ports" | sudo tee -a $LOG_FILE
    else
        echo -e "${GREEN}✅ No suspicious listening ports${NC}"
    fi
    
    # Check SELinux status
    selinux_status=$(getenforce)
    if [ "$selinux_status" != "Enforcing" ]; then
        echo -e "${RED}🚨 CRITICAL: SELinux not in Enforcing mode: $selinux_status${NC}"
        echo "$(date): CRITICAL ALERT - SELinux status: $selinux_status" | sudo tee -a $LOG_FILE
    else
        echo -e "${GREEN}✅ SELinux enforcing${NC}"
    fi
}

# Function to calculate overall security score
calculate_security_score() {
    score=100
    
    # Deduct points for security issues
    if bluetoothctl show | grep -q "Discoverable: yes"; then score=$((score - 15)); fi
    if [ "$(getenforce)" != "Enforcing" ]; then score=$((score - 25)); fi
    if ! sudo firewall-cmd --state | grep -q "running"; then score=$((score - 30)); fi
    
    device_count=$(bluetoothctl devices | wc -l)
    if [ $device_count -gt $ALERT_THRESHOLD_BLUETOOTH_DEVICES ]; then score=$((score - 10)); fi
    
    # Performance impact on security
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}' | awk -F'us' '{print $1}')
    mem_usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
    
    if (( $(echo "$cpu_usage > $ALERT_THRESHOLD_CPU" | bc -l) )); then score=$((score - 5)); fi
    if [ $mem_usage -gt $ALERT_THRESHOLD_MEM ]; then score=$((score - 5)); fi
    
    echo $score
}

# Function to display security dashboard
display_security_dashboard() {
    clear
    echo -e "${GREEN}🛡️ HHDAO SECURITY DASHBOARD${NC}"
    echo "================================"
    echo "$(date)"
    echo ""
    
    # Get current security score
    security_score=$(calculate_security_score)
    
    if [ $security_score -ge 90 ]; then
        status_color=$GREEN
        status_icon="🛡️"
        status_text="EXCELLENT"
    elif [ $security_score -ge 70 ]; then
        status_color=$YELLOW
        status_icon="⚠️"
        status_text="GOOD"
    else
        status_color=$RED
        status_icon="🚨"
        status_text="NEEDS ATTENTION"
    fi
    
    echo -e "${status_color}${status_icon} SECURITY STATUS: ${status_text} (${security_score}/100)${NC}"
    echo ""
    
    # Show active protections
    echo -e "${BLUE}🔒 ACTIVE PROTECTIONS:${NC}"
    
    # Check secure mode
    if [ -f ~/.hhdao_security_status ]; then
        source ~/.hhdao_security_status
        if [ "$SECURE_MODE_ACTIVE" = "true" ]; then
            echo -e "${GREEN}✅ Secure Mode Active${NC}"
        fi
    fi
    
    # Check individual components
    if bluetoothctl show | grep -q "Discoverable: no"; then
        echo -e "${GREEN}✅ Bluetooth Non-Discoverable${NC}"
    else
        echo -e "${YELLOW}⚠️ Bluetooth Discoverable${NC}"
    fi
    
    if sudo firewall-cmd --state | grep -q "running"; then
        echo -e "${GREEN}✅ Firewall Active${NC}"
    else
        echo -e "${RED}🚨 Firewall Inactive${NC}"
    fi
    
    if [ "$(getenforce)" = "Enforcing" ]; then
        echo -e "${GREEN}✅ SELinux Enforcing${NC}"
    else
        echo -e "${RED}🚨 SELinux Not Enforcing${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}📊 CURRENT METRICS:${NC}"
    echo "Bluetooth Devices: $(bluetoothctl devices | wc -l)"
    echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}' | awk -F'us' '{print $1}')%"
    echo "Memory Usage: $(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')%"
    echo ""
    echo -e "${PURPLE}💡 Press Ctrl+C to exit monitoring${NC}"
}

# Main monitoring loop
echo "Starting security monitoring loop..."
trap 'echo -e "\n${GREEN}Security monitoring stopped${NC}"; exit 0' INT

while true; do
    display_security_dashboard
    check_bluetooth_security
    check_network_security  
    check_system_resources
    
    echo -e "\n${BLUE}⏰ Next scan in ${MONITOR_INTERVAL} seconds...${NC}"
    sleep $MONITOR_INTERVAL
done