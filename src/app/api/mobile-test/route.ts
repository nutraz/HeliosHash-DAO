import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);

  const clientIP =
    request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mobile: isMobile,
    userAgent,
    ip: clientIP,
    host: request.headers.get('host'),
    url: request.url,
    message: isMobile ? '📱 Mobile connection successful!' : '💻 Desktop connection successful!',
  });
}
