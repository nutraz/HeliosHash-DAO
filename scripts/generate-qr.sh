#!/bin/bash
# Usage: bash scripts/generate-qr.sh [URL]
# Example: bash scripts/generate-qr.sh http://192.168.29.210:3000

URL=${1:-"http://192.168.29.210:3000"}

if ! command -v qrencode &> /dev/null; then
  echo "qrencode not found. Install it with: sudo dnf install qrencode -y"
  exit 1
fi

echo "Generating QR code for: $URL"
qrencode -o hhdao-qr.png "$URL"
echo "QR code saved as hhdao-qr.png"
echo "Scan this image with your phone to open the app."
