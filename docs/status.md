# HeliosHash DAO Status Endpoint

The `/api/status` endpoint provides comprehensive runtime information about the HeliosHash DAO application, including system metrics, build information, Internet Computer replica probe, and (placeholder) canister health status.

## Endpoint

```
GET /api/status
```

## Response Structure

```
{
  "status": "ok",
  "timestamp": "2025-10-01T12:34:56.789Z",
  "uptimeMs": 123456,
  "uptime": "0h 2m 3s",
  "ip": "192.168.1.100",
  "nodeVersion": "v18.x.x",
  "pid": 12345,
  "memory": { ... process.memoryUsage() ... },
  "port": "3001",
  "env": {
    "NODE_ENV": "development",
    "PORT": "3001",
    "CANISTER_ID_HHDAO_DAO": "rrkah-fqaaa-aaaaa-aaaaq-cai",
    "CANISTER_ID_HHDAO_IDENTITY": "ryjl3-tyaaa-aaaaa-aaaba-cai"
  },
  "build": {
    "buildTime": "2025-10-01T10:00:00.000Z",
    "buildEpoch": 1696154400000
  },
  "git": {
    "commit": "abc123def456",
    "branch": "main",
    "time": "2025-10-01T09:55:30.000Z"
  },
  "replica": {
    "status": "up",
    "latencyMs": 45
  },
  "canisters": {
    "totalDefined": 7,
    "core": [
      "hhdao",
      "hhdao_dao",
      "hhdao_identity",
      "hhdao_telemetry",
      "hhdao_documents"
    ],
    "health": [
      { "name": "hhdao", "reachable": true },
      { "name": "hhdao_dao", "reachable": true },
      { "name": "hhdao_identity", "reachable": true }
    ]
  },
  "message": "HeliosHash DAO status OK",
  "version": 1
}
```

## Field Reference

### Core System

- `status`: High-level status string (currently always `ok` unless future error handling populates otherwise)
- `timestamp`: ISO 8601 generation time of this snapshot
- `uptimeMs` / `uptime`: Milliseconds & human readable uptime since process start
- `ip`: First non-internal IPv4 discovered
- `port`: Effective listening port (from `PORT` or fallback)
- `memory`: Node.js memory usage object
- `nodeVersion`, `pid`: Runtime identification

### Environment (`env`)

Whitelisted environment variables only (to avoid leaking secrets):

- `NODE_ENV`
- `PORT`
- `CANISTER_ID_HHDAO_DAO`
- `CANISTER_ID_HHDAO_IDENTITY`

Extend whitelist cautiously if additional IDs are needed.

### Build Metadata (`build`)

Heuristic build metadata derived from `package.json` mtime:

- `buildTime` ISO timestamp
- `buildEpoch` milliseconds since epoch

### Git Metadata (`git`)

Lightweight parsing of `.git/HEAD` and ref file for:

- `commit`
- `branch`
- `time`: Time the git data was read (not commit time) – future enhancement could parse last commit timestamp.

### Replica Probe (`replica`)

A simple HTTP GET to `http://127.0.0.1:8000/` with timeout (2.5s):

- `status`: `up`, `degraded`, or `down`
- `latencyMs`: Present if request returned before timeout & <400 status
- `error`: Error or timeout reason (only when `down`)

### Canisters (`canisters`)

Static summary with optimistic health (placeholder):

- `totalDefined`
- `core`: Core canister identifiers
- `health`: Array with `{ name, reachable }` (currently always `true`)

Future improvements:

1. Instantiate generated actors and invoke a trivial method to confirm responsiveness.
2. Attach version/build info from each canister if available.
3. Add caching layer to avoid excess round trips.

### Versioning

`version`: Schema version for the status payload (starts at `1`). Bump if breaking changes occur.

## Error Handling

Current implementation favors resiliency: if a sub-component (git, build, replica) fails, the rest of the payload still returns. Future: add top-level `status: "error"` and `errors: []` collection if critical checks fail.

## Security Considerations

- Intentionally filters environment variables.
- Does not expose secret keys or tokens.
- Only high-level canister identifiers and optimistic reachability shown.

## Monitoring Recommendations

- Alert if `replica.status` != `up` for sustained interval (e.g., >2 consecutive probes)
- Track memory.rss & heapUsed for growth trends (potential leaks)
- Track uptime resets (unexpected restarts)
- Verify canister health once real probes are implemented

## Example cURL

```bash
curl -s http://localhost:3001/api/status | jq
```

## Roadmap Ideas

- Add CPU load averages
- Add WebSocket active connection count
- Add per-canister method latency sampling
- Integrate structured health severity levels

---

_This document reflects the current implementation as of 2025-10-01._
