import { NextRequest } from 'next/server';

export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin) return false;
  const originUrl = new URL(origin);
  const allowedHosts = [host, process.env.ALLOWED_ORIGIN_1, process.env.ALLOWED_ORIGIN_2].filter(Boolean);
  return allowedHosts.includes(originUrl.host);
}
