import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// POST: login and set session cookie
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    // TODO: Replace with real authentication
    if (email !== 'admin@helioshash.com' || password !== 'password123') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const user = { id: 'user-1', email, role: 'admin' };
    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(JWT_SECRET);
    const response = NextResponse.json({ success: true, user });
    response.cookies.set({
      name: 'session',
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET: verify session
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
    return NextResponse.json({ authenticated: true, user: { id: payload.userId, email: payload.email, role: payload.role } });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
