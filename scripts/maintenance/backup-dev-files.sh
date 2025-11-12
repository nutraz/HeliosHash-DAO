#!/bin/bash

# Development backup script
BACKUP_DIR="$HOME/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="dev_backup_$TIMESTAMP"
LOG_FILE="$BACKUP_DIR/backup_$TIMESTAMP.log"

echo "Starting backup at $(date)" | tee -a "$LOG_FILE"

# Files and directories to backup (customize as needed)
BACKUP_PATHS=(
    "$HOME/projects"
    "$HOME/documents"
    "$HOME/scripts"
    "$HOME/.config"
    "$HOME/Downloads/important"
)

# Exclude patterns to save space
EXCLUDE_PATTERNS=(
    "--exclude=node_modules"
    "--exclude=.git"
    "--exclude=*.tmp"
    "--exclude=*.log"
    "--exclude=dist"
    "--exclude=build"
    "--exclude=.cache"
    "--exclude=tmp"
)

# Create backup using rsync (incremental)
for path in "${BACKUP_PATHS[@]}"; do
    if [ -e "$path" ]; then
        echo "Backing up: $path" | tee -a "$LOG_FILE"
        rsync -avh "${EXCLUDE_PATTERNS[@]}" "$path" "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null | tee -a "$LOG_FILE"
    else
        echo "Note: $path does not exist - skipping" | tee -a "$LOG_FILE"
    fi
done

# Create compressed archive if backup directory exists
if [ -d "$BACKUP_DIR/$BACKUP_NAME" ]; then
    echo "Creating compressed archive..." | tee -a "$LOG_FILE"
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME" 2>/dev/null
    
    # Calculate backup size
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)
    echo "Backup size: $BACKUP_SIZE" | tee -a "$LOG_FILE"
    
    # Remove uncompressed backup
    rm -rf "$BACKUP_DIR/$BACKUP_NAME"
else
    echo "No files to backup found in specified paths" | tee -a "$LOG_FILE"
fi

# Remove backups older than 30 days
find "$BACKUP_DIR" -name "dev_backup_*.tar.gz" -mtime +30 -delete
find "$BACKUP_DIR" -name "backup_*.log" -mtime +30 -delete

echo "Backup process completed at $(date)" | tee -a "$LOG_FILE"
