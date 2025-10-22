// server.ts - Next.js Standalone + Socket.IO
import { formatDuration, getLocalIPv4, getUptimeMs } from '@/lib/runtime-info';
import { setupSocket } from '@/lib/socket';
import { spawn } from 'child_process';
import { randomBytes } from 'crypto';
import helmet from 'helmet';
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
let currentPort = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const hostname = '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' },
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    // Simple in-memory rate limiting and auth for API routes
    const rateMap = new Map<string, { count: number; resetAt: number }>();
    const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15m
    const MAX_REQ = parseInt(process.env.RATE_LIMIT_MAX || '100');
    const AUTH_TOKEN = process.env.AUTH_TOKEN;

    function getClientIp(req: any): string {
      const xf = req.headers['x-forwarded-for'];
      if (typeof xf === 'string') {
        return xf.split(',')[0].trim();
      }
      return (req.socket && (req.socket.remoteAddress as string)) || 'unknown';
    }

    function checkRateLimit(ip: string): boolean {
      const now = Date.now();
      const entry = rateMap.get(ip);
      if (!entry || now > entry.resetAt) {
        rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return true;
      }
      if (entry.count >= MAX_REQ) return false;
      entry.count += 1;
      return true;
    }

    // Security middleware (CSP/HSTS/etc.)
    const helmetMw = helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          // In dev, Next requires some relaxed policies; in prod, remove 'unsafe-inline'/'unsafe-eval'
          scriptSrc: dev ? ["'self'", "'unsafe-eval'", "'unsafe-inline'"] : ["'self'"],
          styleSrc: dev ? ["'self'", "'unsafe-inline'"] : ["'self'"],
          imgSrc: ["'self'", 'data:', 'blob:'],
          fontSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", 'https://ic0.app', 'http://127.0.0.1:8000', 'http://localhost:8000', `http://localhost:${currentPort}`, `ws://localhost:${currentPort}`],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          upgradeInsecureRequests: [],
        },
      },
      frameguard: { action: 'deny' },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      referrerPolicy: { policy: 'no-referrer' },
      xssFilter: true,
      hidePoweredBy: true,
      noSniff: true,
    } as any);

    const server = createServer((req: any, res: any) => {
      // Apply security headers
      helmetMw(req as any, res as any, () => {});
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }

      // Minimal API security: rate limit and token check for /api/* except status and csrf
      if (req.url?.startsWith('/api/') && !req.url.startsWith('/api/status') && !req.url.startsWith('/api/csrf')) {
        const ip = getClientIp(req);
        if (!checkRateLimit(ip)) {
          res.statusCode = 429;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Too Many Requests' }));
          return;
        }
        // CSRF protection for state-changing methods (double-submit cookie)
        const method = (req.method || 'GET').toUpperCase();
        const needsCsrf = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
        if (needsCsrf) {
          const cookieHeader = req.headers['cookie'] as string | undefined;
          const headerToken = req.headers['x-csrf-token'];
          const cookies = Object.fromEntries(
            (cookieHeader || '')
              .split(';')
              .map((c) => c.trim())
              .filter(Boolean)
              .map((c) => {
                const idx = c.indexOf('=');
                if (idx === -1) return [c, ''];
                return [decodeURIComponent(c.slice(0, idx)), decodeURIComponent(c.slice(idx + 1))];
              }) as [string, string][]
          );
          const cookieToken = cookies['csrfToken'];
          if (typeof headerToken !== 'string' || !cookieToken || headerToken !== cookieToken) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'CSRF verification failed' }));
            return;
          }
        }
        if (AUTH_TOKEN) {
          const authHeader = req.headers['authorization'];
          const tokenHeader = req.headers['x-auth-token'];
          const bearer = authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : undefined;
          const provided = (typeof tokenHeader === 'string' ? tokenHeader : undefined) || bearer;
          if (provided !== AUTH_TOKEN) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
          }
        }
      }

      // Handle CSRF token issuance
      if (req.url === '/api/csrf' && req.method?.toUpperCase() === 'GET') {
        const token = randomBytes(24).toString('hex');
        const secure = !dev ? '; Secure' : '';
        const cookie = `csrfToken=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secure}`;
        res.statusCode = 200;
        res.setHeader('Set-Cookie', cookie);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ token }));
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    setupSocket(io);

    function attemptListen(port: number, attempt = 0) {
      server.once('error', (err: any) => {
        if (err.code === 'EADDRINUSE' && attempt < 9) {
          const nextPort = port + 1;
          console.warn(`Port ${port} in use, trying ${nextPort}...`);
          attemptListen(nextPort, attempt + 1);
        } else {
          console.error('Failed to bind server:', err);
          process.exit(1);
        }
      });
      server.listen(port, hostname, () => {
        currentPort = port;
        const ip = getLocalIPv4();
        console.log('──────────────────────────────────────────────');
        console.log(`> HeliosHash Dev Server Ready`);
        console.log(`> Local:      http://localhost:${currentPort}`);
        console.log(`> Network:    ${ip ? `http://${ip}:${currentPort}` : 'IP not detected'}`);
        console.log(`> Socket.IO:  ws://${hostname}:${currentPort}/api/socketio`);
        if (port !== (process.env.PORT ? parseInt(process.env.PORT) : 3001)) {
          console.log(`> Note: Fallback port selected (original busy).`);
        }
        if (!ip) {
          console.log('⚠ Could not detect LAN IP automatically (may be a VPN / container).');
        }
        console.log('──────────────────────────────────────────────');
  // Spawn QR code generator for developer convenience
  const qrArgs = [`http://localhost:${currentPort}`];
  // Use CJS variant to avoid ESM require errors under type: module
  spawn('node', ['scripts/display-qr.cjs', ...qrArgs], { stdio: 'inherit' });
      });
    }

    attemptListen(currentPort);

    // Prevent server from crashing on unhandled promises
    process.on('unhandledRejection', (reason, promise) => {
      console.log('[unhandledRejection]', reason);
    });

    process.on('uncaughtException', (error) => {
      console.log('[uncaughtException]', error);
    });

    setInterval(() => {
      // lightweight heartbeat
      process.stdout.write(`heartbeat uptime=${formatDuration(getUptimeMs())}    \r`);
    }, 15000).unref();
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
