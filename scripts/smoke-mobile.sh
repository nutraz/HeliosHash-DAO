#!/usr/bin/env bash
# Lightweight smoke script: start mobile server in background and show LAN URL
set -euo pipefail

PORT=3003
HOST=0.0.0.0

echo "Starting mobile server on port $PORT..."
nohup node mobile_hhdao_server.js > mobile_server.log 2>&1 &
PID=$!
sleep 1

# Get LAN IP
LAN_IP=$(hostname -I | awk '{print $1}')
echo "Mobile server (pid $PID) started. Access it at: http://$LAN_IP:$PORT"
echo "Logs: mobile_server.log"

exit 0
