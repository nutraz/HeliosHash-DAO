#!/bin/bash
BACKUP_DIR="$HOME/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="dev_backup_$TIMESTAMP"

echo "Quick backup starting at $(date)"

# Create backup directory
mkdir -p "$BACKUP_DIR/$BACKUP_NAME"

# Backup only essential files without compression
echo "Backing up projects..."
[ -d "$HOME/projects" ] && rsync -a --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='build' "$HOME/projects/" "$BACKUP_DIR/$BACKUP_NAME/projects/"

echo "Backing up documents..."
[ -d "$HOME/documents" ] && rsync -a "$HOME/documents/" "$BACKUP_DIR/$BACKUP_NAME/documents/"

echo "Backing up scripts..."
[ -d "$HOME/scripts" ] && rsync -a "$HOME/scripts/" "$BACKUP_DIR/$BACKUP_NAME/scripts/"

echo "Backing up important configs..."
[ -d "$HOME/.config" ] && rsync -a --exclude='.cache' "$HOME/.config/" "$BACKUP_DIR/$BACKUP_NAME/.config/"

# Remove backups older than 7 days (shorter retention for quick backups)
find "$BACKUP_DIR" -name "dev_backup_*" -type d -mtime +7 -exec rm -rf {} +

echo "Quick backup completed: $BACKUP_DIR/$BACKUP_NAME/"
echo "Total size: $(du -sh "$BACKUP_DIR/$BACKUP_NAME" | cut -f1)"
