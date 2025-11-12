# HHDAO Full Setup — Usage & Guide

This document describes `hhdao-full-setup.sh`, a convenience script that syncs the repository, updates dependencies, builds artifacts, and (optionally) starts the development server under PM2.

## Purpose

- Provide a one-command environment setup for new developers.
- Allow safe validation with `--dry-run` before making changes.
- Automate PM2 dev-server setup for consistent local runs.

## Location

`hhdao-full-setup.sh` is in the repository root.

## Flags

- `--dry-run`, `-n` — Show what would happen without making changes. Safe for PR validation.
- `--help`, `-h` — Show short usage information.

## Typical Workflow

1. Validate the script on your machine or CI:

```bash
./hhdao-full-setup.sh --dry-run
```

2. Run a real setup (will perform updates, builds, and may require `sudo`):

```bash
chmod +x hhdao-full-setup.sh
./hhdao-full-setup.sh
```

3. If you only want the dev server started under PM2, the script will call `scripts/setup-pm2.sh` if present.

## CI Integration

We provide a GitHub Actions workflow that runs `./hhdao-full-setup.sh --dry-run` on PRs to validate changes to the script without side effects.

## Notes & Safety

- The script attempts to be conservative in `--dry-run` mode and will not remove or modify critical user data.
- System upgrades (`dnf upgrade` / `apt upgrade`) are executed during a full run and may prompt for `sudo`. Review the script before running in production.

## Troubleshooting

- If the script fails on `flutter` steps, ensure Flutter is installed and on your `PATH`.
- For PM2 startup issues, run `pm2 logs` and check `ecosystem.config.cjs` in `apps/web/`.

## Contact

If you encounter issues, open a GitHub issue or mention the maintainer in PR #36.
