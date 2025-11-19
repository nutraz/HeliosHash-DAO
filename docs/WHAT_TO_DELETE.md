# WHAT TO DELETE (Proposed)

This file lists the folders and files that should be removed as part of the cleanup PR. These are legacy, duplicates, personal notes, or otherwise unsafe to keep in the main repository.

Important: This is a proposed list only — please confirm before deleting anything. We will move items to `archive/legacy` when appropriate.

Folders to remove
-----------------

```
.continue/
archive/
archives/
archives/old-builds/
archive/legacy/
archive/old-builds/
archive/logs/
archive/old-backups/
app/                   # old Next13 folder — migrate changes first
backend/               # unify under services/api
src/declarations/      # outdated dfx auto-gen
tools/                 # merge into scripts/
WIP*                   # temporary work
```

Files to delete or archive
---------------------------

```
CLAUDE DASHBOARD.docx
grokdashboard.txt
nutraz Perfect I understand.txt
helios#baghpat.txt
hhdao_security_audit_*.txt  # move to docs/security
*.bak
*.txt
*.pdf
*.docx
```

Dockerfile cleanup
------------------
Keep only the following at the repo root:

```
Dockerfile
Dockerfile.dev
docker-compose.yml
```

Delete or archive all other Dockerfile.* variants.

ESLint / Config deduplication
-----------------------------
Remove duplicates and keep a canonical set at the repo root. Consolidate configs under `config/` only if needed.

Notes
-----
- This PR is non-destructive. Where possible, move files to `archive/legacy` and add a short notice in `ARCHIVE_README.md`.
- If a file is referenced by CI or external jobs, ensure those links are updated before removing.
