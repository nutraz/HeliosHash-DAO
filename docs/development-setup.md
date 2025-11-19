# HeliosHash DAO Development Setup

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- (Optional) Docker

### Install Dependencies

```
pnpm install
```

### Start Development Server (Custom Server + Socket.IO)

```
pnpm dev
```

Wait until you see:

```
HeliosHash Dev Server Ready
Local:      http://localhost:3001
```

### One-Line Health Check

```
pnpm health
```

Shows listener presence and parses `/api/status`.

### Start + Health (combined)

```
pnpm dev:health
```

Starts the server and then runs the health script.

### Mobile / LAN Friendly Startup

```
pnpm mobile-dev
```

Selects an available port (prefers 3005, falls back to 3001), enables firewall rule (if `firewall-cmd` present), prints a QR code (if `qrcode` dependency present), and tails `dev.log`.

## Key Endpoints

- Root App: `http://localhost:3001/`
- Health: `http://localhost:3001/api/status`
- Socket.IO Path: `ws://localhost:3001/api/socketio`
- Socket Test: `http://localhost:3001/api/socket-test?test=ping`

## Connectivity Component

The dashboard now includes a `ConnectivityStatus` card reporting:

- Server (HEAD /)
- API (/api/status)
- Socket.IO test (/api/socket-test)

Refreshes automatically every 30s.

## Scripts Added

| Script            | Purpose                                    |
| ----------------- | ------------------------------------------ |
| `pnpm health`     | Verify listener + parse health JSON        |
| `pnpm dev:health` | Start dev then run health check            |
| `pnpm mobile-dev` | Mobile-focused startup with readiness & QR |

## Docker Port Mapping

Current production profile maps host 3001 → container 3000. If you reconfigure the custom server to listen internally on 3001, adjust mapping accordingly:

```yaml
aaa: # snippet
  ports:
    - '3001:3000' # current
    # - "3001:3001" # if container listens on 3001
```

## Troubleshooting

| Symptom                | Checks                                                   |
| ---------------------- | -------------------------------------------------------- |
| Browser cannot connect | `pnpm health`; confirm readiness banner                  |
| Health script fails    | Inspect `dev.log`; confirm `/api/status` route           |
| Socket issues          | Hit `/api/socket-test?test=ping`; check console for CORS |
| Port in use            | `lsof -i:3001`; kill stray process; retry dev script     |

## Typical Recovery Flow

1. Ctrl+C the dev server
2. `pkill -f "tsx server.ts"` (ensure no orphan)
3. `pnpm dev`
4. Wait for readiness; run `pnpm health`

## Advanced

- Add `DEBUG=*` before `pnpm dev` for verbose logs.
- Append `?devtools=true` to enable React Query DevTools on demand.

## Future Enhancements (Optional)

- Integrate status aggregation from canisters
- Add build hash/version to `/api/status`
- Provide WebSocket round-trip latency metric

---

_This document is generated alongside recent reliability tooling improvements._
