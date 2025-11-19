#!/usr/bin/env bash
set -euo pipefail

KEYFILE="${HOME}/.ssh/id_ed25519"

echo "Generating strong Ed25519 SSH key (you will be prompted for a passphrase)..."

if [[ -f "$KEYFILE" ]]; then
  echo "Key already exists: $KEYFILE"
else
  ssh-keygen -t ed25519 -C "$(whoami)@$(hostname)-$(date +%F)" -f "$KEYFILE"
fi

# Ensure agent is running (idempotent)
if ! pgrep -u "$USER" ssh-agent > /dev/null; then
  eval "$(ssh-agent -s)"
fi
ssh-add "$KEYFILE"

echo
echo "PUBLIC KEY (copy to GitHub / GitLab / etc.):"
cat "${KEYFILE}.pub"
echo
echo "2FA INSTRUCTIONS"
echo "  • GitHub: Settings → Security → Two-factor authentication → App/SMS"
echo "  • GitLab: User Settings → Account → Two-factor authentication"
echo "  • Store recovery codes in a password manager!"
