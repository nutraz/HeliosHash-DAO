import { NextResponse } from 'next/server';
import { loginDemo, getUser, joinDaoMock } from '@/lib/mockServer';

export async function GET() {
  const user = getUser();
  return NextResponse.json({ ok: user });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  // POST /api/users/login -> demo login
  if (pathname.endsWith('/login')) {
    const user = loginDemo();
    return NextResponse.json({ ok: user });
  }
  if (pathname.endsWith('/join')) {
    const user = joinDaoMock();
    return NextResponse.json({ ok: user });
  }
  return NextResponse.json({ error: 'unknown action' }, { status: 400 });
}
