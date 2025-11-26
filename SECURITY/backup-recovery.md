# Backup & Recovery Procedures

## Backup Schedule

### Daily Backups
- Database snapshots (if applicable)
- Canister state exports
- Configuration files

### Weekly Backups  
- Full system images
- Code repository archives
- Documentation backups

## Backup Locations
1. **Primary**: Encrypted S3/Azure Blob Storage
2. **Secondary**: Offsite cold storage
3. **Tertiary**: Local encrypted drives

## Recovery Procedures

### Database Recovery
```bash
# Example for PostgreSQL
pg_restore -d $DATABASE_URL backup.dump

# For SQLite
cp backup.db production.db
```

### Canister Recovery
```bash
# Export canister state
dfx canister call --network ic <canister> __get_cycles

# Import canister state  
dfx canister install --mode upgrade <canister>
```

### Frontend Recovery
```bash
# Redeploy from last known good commit
git checkout <stable-commit>
vercel --prod

# Or use Vercel rollback
vercel --prod --prev
```

## Verification Procedures
- Test restore in staging environment quarterly
- Validate backup integrity monthly
- Document recovery time objectives (RTO/RPO)

## Emergency Contacts for Backup Access
- @nutraz: Primary backup access
- @nick: Secondary backup access
