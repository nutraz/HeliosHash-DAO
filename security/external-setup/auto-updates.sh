#!/usr/bin/env bash
set -euo pipefail

# ---- SUDO CHECK ----
if ! sudo -n true 2>/dev/null; then
  echo "This script requires password-less sudo (or run with sudo)."
  exit 1
fi

# Detect OS
if grep -q "ID=ubuntu\|ID=debian" /etc/os-release; then
  OS="ubuntu"
elif grep -q "ID=fedora" /etc/os-release; then
  OS="fedora"
else
  echo "Unsupported OS. This script supports Ubuntu/Debian and Fedora."
  exit 1
fi

echo "Installing/configuring automatic updates for $OS (security-only)..."

if [ "$OS" = "ubuntu" ]; then
  # Ubuntu/Debian logic
  # Install
  sudo apt update
  sudo apt install -y unattended-upgrades apt-listchanges

  # Enable the GUI prompt only once
  if ! dpkg-reconfigure -f noninteractive unattended-upgrades; then
    echo "Failed to enable unattended-upgrades"
    exit 1
  fi

  # Harden config (security origins only, auto-reboot optional)
  CONFIG="/etc/apt/apt.conf.d/50unattended-upgrades"
  sudo cp "$CONFIG" "${CONFIG}.bak"   # backup

  sudo tee "$CONFIG" > /dev/null <<'EOF'
Unattended-Upgrade::Origins-Pattern {
        "origin=Ubuntu,archive=${distro_id},codename=${distro_codename}-security";
        "origin=Ubuntu,archive=${distro_id},codename=${distro_codename}-updates";
};
Unattended-Upgrade::Package-BlackList {};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::Mail "root";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-WithUsers "false";
EOF

  # Enable timer
  sudo systemctl enable --now unattended-upgrades

  echo "Automatic security updates configured."
  echo "  * Reboot disabled – change Automatic-Reboot to true if desired."
  echo "  * Check logs: journalctl -u unattended-upgrades"

elif [ "$OS" = "fedora" ]; then
  # Fedora logic
  # Install dnf-automatic
  sudo dnf install -y dnf-automatic

  # Configure for security updates only
  CONFIG="/etc/dnf/automatic.conf"
  sudo cp "$CONFIG" "${CONFIG}.bak"   # backup

  sudo tee "$CONFIG" > /dev/null <<'EOF'
[commands]
upgrade_type = security
random_sleep = 0
download_updates = yes
apply_updates = yes
reboot = never
reboot_command = "shutdown -r +5 'Rebooting after applying security updates'"
emit_via = stdio
system_name = $(hostname)
emit_to = root
output_width = 80
email_from = root
email_to = root
email_host = localhost
group_list = None
exclude = None
include = None
debuglevel = 1
assumeyes = yes
EOF

  # Enable timer
  sudo systemctl enable --now dnf-automatic.timer

  echo "Automatic security updates configured for Fedora."
  echo "  * Reboot disabled – change reboot = never to reboot = when-needed if desired."
  echo "  * Check logs: journalctl -u dnf-automatic"
fi
