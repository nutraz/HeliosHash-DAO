#!/bin/bash
# dev-security-setup-automation.sh
# Automates all tasks in the dev security setup TODO list
set -e

cd "$(dirname "$0")"

echo "1. Making all scripts executable..."
chmod +x *.sh

echo "2. Running auto-updates.sh to activate unattended upgrades..."
./auto-updates.sh

echo "3. Running ssh-setup.sh to generate SSH key..."
./ssh-setup.sh

if command -v gh &>/dev/null; then
  echo "4. Registering SSH key with GitHub using gh CLI..."
  gh ssh-key add ~/.ssh/id_rsa.pub --title "$(hostname)-$(date +%Y%m%d)"
else
  echo "4. Please register your SSH key with GitHub manually."
fi

echo "5. Creating backup-setup.sh for rsync backup system (template only, edit as needed)..."
if [ ! -f backup-setup.sh ]; then
  cat <<'EOF' > backup-setup.sh
#!/bin/bash
# TODO: Implement rsync backup logic here
EOF
  chmod +x backup-setup.sh
fi

echo "6. Renaming current backup-setup.sh to tools-update.sh if needed..."
if [ -f backup-setup.sh ] && [ ! -f tools-update.sh ]; then
  mv backup-setup.sh tools-update.sh
fi

echo "7. Scheduling tools-update.sh weekly via cron..."
croncmd="$(pwd)/tools-update.sh"
cronjob="0 3 * * 0 $croncmd # dev-security-setup tools update"
(crontab -l 2>/dev/null | grep -v "$croncmd"; echo "$cronjob") | crontab -

echo "8. Running tools-update.sh to update tools..."
./tools-update.sh

echo "9. Addressing HeliosHash-DAO security audit findings..."
if [ -d ../HeliosHash-DAO ]; then
  cd ../HeliosHash-DAO
  pnpm audit || true
  pnpm audit fix || true
  cd -
else
  echo "HeliosHash-DAO directory not found. Skipping audit."
fi

echo "10. Running docker-setup.sh for Docker environment..."
if [ -f docker-setup.sh ]; then
  ./docker-setup.sh
else
  echo "docker-setup.sh not found. Skipping."
fi

echo "11. Running e2e tests in HeliosHash-DAO to verify setup..."
if [ -d ../HeliosHash-DAO ]; then
  cd ../HeliosHash-DAO
  if [ -d tests ] || [ -d e2e ]; then
    pnpm test || echo "e2e tests failed or not configured."
  else
    echo "No e2e test directory found."
  fi
  cd -
else
  echo "HeliosHash-DAO directory not found. Skipping e2e tests."
fi

echo "=== All dev security setup tasks automated ==="
