import { NextResponse } from 'next/server';
import { getAllProfiles, getProfile } from '@/lib/socialMock';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const handle = url.searchParams.get('handle');
  if (handle) {
    const p = getProfile(handle);
    if (!p) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ data: p });
  }
  return NextResponse.json({ data: getAllProfiles() });
}
