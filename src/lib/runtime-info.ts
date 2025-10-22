// runtime-info.ts - central runtime diagnostics helpers
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';

const startTime = Date.now();
let cachedGit: { commit?: string; branch?: string; time?: string } | null = null;
let buildMeta: { buildTime: string; buildEpoch: number } | null = null;

function loadGitMeta(): { commit?: string; branch?: string } {
  if (cachedGit) return cachedGit;
  try {
    const gitDir = path.join(process.cwd(), '.git');
    const headPath = path.join(gitDir, 'HEAD');
    if (!fs.existsSync(headPath)) return (cachedGit = {});
    const head = fs.readFileSync(headPath, 'utf8').trim();
    let branch: string | undefined;
    let commit: string | undefined;
    if (head.startsWith('ref:')) {
      branch = head.split('ref:')[1].trim().split('/').slice(-1)[0];
      const refPath = path.join(gitDir, head.replace('ref: ', ''));
      if (fs.existsSync(refPath)) commit = fs.readFileSync(refPath, 'utf8').trim();
    } else {
      commit = head;
    }
    cachedGit = { commit, branch, time: new Date().toISOString() };
    return cachedGit;
  } catch {
    return (cachedGit = {});
  }
}

function resolveBuildMeta() {
  if (buildMeta) return buildMeta;
  // Heuristic: use mtime of package.json as a proxy for latest build
  try {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const stat = fs.statSync(pkgPath);
    buildMeta = { buildTime: stat.mtime.toISOString(), buildEpoch: stat.mtimeMs };
  } catch {
    buildMeta = { buildTime: new Date(startTime).toISOString(), buildEpoch: startTime };
  }
  return buildMeta;
}

export interface ReplicaProbeResult {
  status: 'up' | 'down' | 'degraded';
  latencyMs?: number;
  error?: string;
}

export async function probeReplica(url = 'http://127.0.0.1:8000/'): Promise<ReplicaProbeResult> {
  const start = Date.now();
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      const latency = Date.now() - start;
      const status = res.statusCode && res.statusCode < 400 ? 'up' : 'degraded';
      res.resume();
      resolve({ status, latencyMs: latency });
    });
    req.setTimeout(2500, () => {
      req.destroy();
      resolve({ status: 'down', error: 'timeout' });
    });
    req.on('error', (err) => {
      resolve({ status: 'down', error: err.message });
    });
  });
}

export function getUptimeMs(): number {
  return Date.now() - startTime;
}

export function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

export function getLocalIPv4(): string | null {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const info of ifaces[name] || []) {
      if (info && info.family === 'IPv4' && !info.internal) {
        // Skip docker / podman typical subnets if needed in future
        return info.address;
      }
    }
  }
  return null;
}

export function buildStatusSnapshot(extra?: Record<string, unknown>) {
  const ip = getLocalIPv4();
  const git = loadGitMeta();
  const build = resolveBuildMeta();
  const port = process.env.PORT || process.env.NEXT_PUBLIC_PORT || '3000';
  const whitelist = ['NODE_ENV', 'PORT', 'CANISTER_ID_HHDAO_DAO', 'CANISTER_ID_HHDAO_IDENTITY'];
  const envFiltered: Record<string, string | undefined> = {};
  whitelist.forEach((k) => (envFiltered[k] = process.env[k]));
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeMs: getUptimeMs(),
    uptime: formatDuration(getUptimeMs()),
    ip,
    nodeVersion: process.version,
    pid: process.pid,
    memory: process.memoryUsage(),
    port,
    env: envFiltered,
    build,
    git,
    ...extra,
  } as const;
}

export type RuntimeStatus = ReturnType<typeof buildStatusSnapshot>;
