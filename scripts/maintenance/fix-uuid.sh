#!/bin/bash
# Fedora UUID repair & initramfs rebuild script
# Run this as root or with sudo

set -e

echo "🔍 Detecting your main LUKS/Btrfs partition..."
MAIN_UUID=$(blkid | grep 'luks-730828ed' | grep -o 'UUID="[^"]*"' | cut -d'"' -f2)

if [ -z "$MAIN_UUID" ]; then
  echo "❌ Could not detect main LUKS/Btrfs UUID automatically."
  echo "Run 'sudo blkid' manually and copy the correct UUID."
  exit 1
fi

echo "✅ Found main partition UUID: $MAIN_UUID"

# Backup existing fstab
cp /etc/fstab /etc/fstab.backup.$(date +%F-%H%M)
echo "🧾 Backup created: /etc/fstab.backup.$(date +%F-%H%M)"

# Replace old/broken UUID
sed -i 's/b78a3173-8b16-46c1-9d70-568462a3e0a8/'"$MAIN_UUID"'/g' /etc/fstab

echo "🔧 Updated /etc/fstab with correct UUIDs:"
grep UUID /etc/fstab

echo "⚙️ Rebuilding initramfs..."
dracut -f

echo "🔄 Reloading systemd mounts..."
systemctl daemon-reload

echo "✅ All done!"
echo "You can reboot now safely:"
echo "   sudo reboot"
