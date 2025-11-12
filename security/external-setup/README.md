# Dev Security Setup (Hardened)

Run scripts **in order**. All are idempotent.

```bash
chmod +x *.sh
./auto-updates.sh
./ssh-setup.sh          # you will be prompted for a passphrase
./backup-setup.sh       # edit SOURCE in the script if needed
./tools-update.sh
./environments-docker.sh
```

# Updates
journalctl -u unattended-upgrades -n 20

# SSH
ssh -T git@github.com

# Backup
crontab -l
tail -f ~/backups/backup.log

# Docker
docker compose --profile dev up
