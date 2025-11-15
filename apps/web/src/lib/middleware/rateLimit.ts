import { NextRequest, NextResponse } from 'next/server';

const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  request: NextRequest,
  maxRequests: number = 10,
  windowMs: number = 60000
): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  let limit = rateLimits.get(ip);
  if (!limit || now > limit.resetAt) {
    limit = { count: 0, resetAt: now + windowMs };
  }
  limit.count++;
  rateLimits.set(ip, limit);
  if (limit.count > maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  return null;
}
