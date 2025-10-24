// server.ts - Next.js Standalone + Socket.IO
import { formatDuration, getLocalIPv4, getUptimeMs } from '@/lib/runtime-info';
import { setupSocket } from '@/lib/socket';
import { spawn } from 'child_process';
import { randomBytes } from 'crypto';
import { authLimiter, apiLimiter, readLimiter, getRateLimitKey } from '@/lib/rate-limit';
import Redis from 'ioredis';
// Redis client for CSRF token storage
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
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
    // Redis-backed rate limiting for API routes
    const AUTH_TOKEN = process.env.AUTH_TOKEN;

    // Security middleware (CSP/HSTS/etc.)
    const helmetMw = helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: dev ? ["'self'", "'unsafe-eval'", "'unsafe-inline'"] : ["'self'"],
          styleSrc: dev ? ["'self'", "'unsafe-inline'"] : ["'self'"],
          imgSrc: ["'self'", 'data:', 'blob:'],
          fontSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", 'https://ic0.app', 'http://127.0.0.1:8000', 'http://localhost:8000', `http://localhost:${currentPort}`, `ws://localhost:${currentPort}`],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          upgradeInsecureRequests: []
        }
      },
      frameguard: { action: 'deny' },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      referrerPolicy: { policy: 'no-referrer' },
      xssFilter: true,
      hidePoweredBy: true,
      noSniff: true
    });

    // Middleware to block .git and directory listing
    const securityMiddleware = (req: any, res: any, next: any) => {
      // Block .git and other sensitive folders
      if (req.url.startsWith('/.git') || req.url.startsWith('/.env') || req.url.match(/\.(env|git|DS_Store|log)$/)) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      // Block directory listing (if URL ends with / and is not a known route)
      if (req.url.match(/\/$/) && !req.url.startsWith('/api/') && !req.url.startsWith('/_next/')) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      next();
    };

    const server = createServer((req: any, res: any) => {
      (async () => {
        // Apply security headers
        helmetMw(req as any, res as any, () => {});
        // Skip socket.io requests from Next.js handler
        if (req.url?.startsWith('/api/socketio')) {
          return;
        }

        // Tiered Redis-backed rate limiting for /api/* except status and csrf
        if (req.url?.startsWith('/api/') && !req.url.startsWith('/api/status') && !req.url.startsWith('/api/csrf')) {
          const key = getRateLimitKey(req);
          let limiter = apiLimiter;
          // Stricter limit for auth endpoints
          if (/\/api\/(login|logout|refresh|session)/.test(req.url)) {
            limiter = authLimiter;
          } else if (/\/api\/(public|read|info)/.test(req.url)) {
            limiter = readLimiter;
          }
          limiter.consume(key).catch((rejRes: any) => {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Retry-After', Math.ceil(rejRes.msBeforeNext / 1000));
            res.end(JSON.stringify({ error: 'Too Many Requests', retryAfter: rejRes.msBeforeNext }));
          });
          // CSRF protection for state-changing methods (Redis-backed, session-bound, rotating)
          const method = (req.method || 'GET').toUpperCase();
          const needsCsrf = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
          if (needsCsrf) {
            const cookieHeader = req.headers['cookie'] as string | undefined;
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
            const sessionId = cookies['hhdao_session'] || req.headers['x-session-id'] || key;
            const headerToken = req.headers['x-csrf-token'];
            const cookieToken = cookies['hhdao_csrf'];
            // Validate CSRF token: must match Redis and not be expired
            const storedToken = await redisClient.get(`csrf:${sessionId}`);
            if (
              typeof headerToken !== 'string' ||
              !cookieToken ||
              headerToken !== cookieToken ||
              !storedToken ||
              headerToken !== storedToken
            ) {
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

        // Handle CSRF token issuance (rotating, session-bound, Redis-backed)
        if (req.url === '/api/csrf' && req.method?.toUpperCase() === 'GET') {
          // Get session ID from cookie or header (fallback to IP)
          const cookieHeader = req.headers['cookie'] as string | undefined;
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
          const sessionId = cookies['hhdao_session'] || req.headers['x-session-id'] || getRateLimitKey(req);
          const csrfToken = randomBytes(32).toString('hex');
          // Store CSRF token in Redis, bound to session, 1 hour expiry
          await redisClient.set(`csrf:${sessionId}`, csrfToken, 'EX', 3600);
          res.setHeader('Set-Cookie', `hhdao_csrf=${encodeURIComponent(csrfToken)}; Path=/; SameSite=Strict; Max-Age=3600; HttpOnly=false${!dev ? '; Secure' : ''}`);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ csrfToken }));
          return;
        }
        handle(req, res);
      })();
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
