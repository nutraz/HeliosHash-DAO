# PM2 setup sequence

This diagram visualizes the automated steps performed by `scripts/setup-pm2.sh` when preparing the PM2-managed dev server for `helioshash-web`.

```mermaid
sequenceDiagram
  actor User
  participant setup-pm2.sh
  participant npm
  participant PM2
  participant logs

  User->>setup-pm2.sh: Execute script
  setup-pm2.sh->>npm: Check/Install PM2 globally
  npm->>setup-pm2.sh: PM2 installed ✓
  setup-pm2.sh->>logs: Create ./logs directory
  logs->>setup-pm2.sh: Directory ready ✓
  setup-pm2.sh->>PM2: Load ecosystem.config.js
  PM2->>PM2: Start helioshash-web app (port 3002)
  PM2->>setup-pm2.sh: Process running ✓
  setup-pm2.sh->>PM2: Save process list
  PM2->>setup-pm2.sh: List saved ✓
  setup-pm2.sh->>User: Display startup command & usage

```

\
Notes:

- The script will also print the `pm2 startup` command that must be run with `sudo` to register PM2 startup on system boot.

- Logs are stored under `apps/web/logs` by default (see `ecosystem.config.cjs`).
