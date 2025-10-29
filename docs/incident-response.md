# Incident Response Plan

This document outlines steps to detect, triage, contain, eradicate, and recover from security incidents.

## 1. Preparation
- Response team roster and contacts
- Access to logs, monitoring, backups
- Runbooks and on-call schedules

## 2. Identification
- Confirm incident from alerts or reports
- Classify severity (Critical/High/Medium/Low)
- Open an incident ticket and channel

## 3. Containment
- Short-term: isolate affected systems/accounts
- Preserve forensic evidence (logs, snapshots)
- Disable compromised credentials

## 4. Eradication
- Remove malware/backdoors
- Patch vulnerabilities
- Rotate keys and secrets

## 5. Recovery
- Restore from clean backups
- Monitor for reoccurrence
- Gradually return services to normal

## 6. Lessons Learned
- Root cause analysis
- Update controls, tests, and playbooks
- Communicate outcomes to stakeholders

## Reporting
- For responsible disclosure, see SECURITY.md
- For urgent issues, email: security@helioshash.org
