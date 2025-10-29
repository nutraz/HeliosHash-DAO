import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Expanded protected routes
  const protectedRoutes = ['/dashboard', '/governance', '/wallet', '/rewards', '/profile'];
  const token = request.cookies.get('auth_token')?.value;

  // Redirect unauthenticated users to /login for protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token || token === 'invalid_token') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'self'");
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
