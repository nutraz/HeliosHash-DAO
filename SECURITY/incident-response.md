# Incident Response Plan

## Emergency Contacts
- **Lead Architect**: @nutraz (Discord/Telegram)
- **Core Maintainer**: @nick (Discord/Telegram)
- **Infrastructure**: @team (Discord/Telegram)

## Severity Levels

### SEV-1: Critical
- Production system down
- Security breach with fund loss
- Private data exposure

### SEV-2: High  
- Partial service disruption
- Security vulnerability with no exploitation
- Performance degradation

### SEV-3: Medium
- Minor functionality issues
- UI/UX problems
- Non-critical bugs

## Response Procedures

### SEV-1 Response
1. **Immediate Action**: 
   - Notify all emergency contacts
   - Take system offline if necessary
   - Preserve logs and evidence

2. **Containment**:
   - Isolate affected systems
   - Revoke compromised credentials
   - Deploy emergency patches

3. **Investigation**:
   - Root cause analysis
   - Impact assessment
   - Forensic data collection

4. **Recovery**:
   - Deploy fixes
   - Restore from backups
   - Verify system integrity

5. **Post-Mortem**:
   - Document incident
   - Implement preventive measures
   - Update security procedures

## Communication Template

**Subject**: [SEV-LEVEL] Security Incident - [Brief Description]

**Status**: 
- Investigating
- Contained  
- Resolved

**Impact**:
- Systems affected: [List]
- User impact: [Description]
- Timeline: [Start time - Current]

**Actions Taken**:
1. [Action 1]
2. [Action 2]

**Next Steps**:
- [Immediate actions]
- [Long-term fixes]

## Forensic Checklist
- [ ] Preserve server logs
- [ ] Capture network traffic
- [ ] Document system state
- [ ] Backup database/canisters
- [ ] Record timestamps

## Rollback Procedures
```bash
# Canister rollback
dfx canister install --mode reinstall <canister>

# Frontend rollback  
git revert <commit>
vercel --prod --prev
```
