#!/bin/bash

echo "=== Backup System Setup ==="

# Create backup directory
BACKUP_DIR="$HOME/backups"
mkdir -p "$BACKUP_DIR"

# Create backup script
cat > ~/backup-dev-files.sh << 'BACKUPSCRIPT'
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
BACKUPSCRIPT

chmod +x ~/backup-dev-files.sh

# Create a simple test to verify backup works
echo "Creating test directory structure..."
mkdir -p ~/projects/test-backup
echo "test file content" > ~/projects/test-backup/important-file.txt
mkdir -p ~/scripts
echo "sample script" > ~/scripts/backup-test.sh

# Test the backup script
echo "Testing backup system..."
~/backup-dev-files.sh

# Verify backup was created
if ls ~/backups/dev_backup_*.tar.gz 1> /dev/null 2>&1; then
    echo "✓ Backup system test successful"
    # Cleanup test files
    rm -rf ~/projects/test-backup
    rm -f ~/scripts/backup-test.sh
else
    echo "✗ Backup system test failed"
    echo "Check ~/backup-dev-files.sh for issues"
fi

# Setup automatic daily backups
echo "Setting up automatic daily backups at 2 AM..."
(crontab -l 2>/dev/null | grep -v "backup-dev-files.sh"; echo "0 2 * * * $HOME/backup-dev-files.sh >> $HOME/backup-cron.log 2>&1") | crontab -

echo ""
echo "=== Backup Configuration Complete ==="
echo "✓ Backup script: ~/backup-dev-files.sh"
echo "✓ Backup location: $BACKUP_DIR/"
echo "✓ Automatic backups: Daily at 2 AM"
echo "✓ Backup retention: 30 days"
echo ""
echo "To customize backup paths, edit ~/backup-dev-files.sh"
