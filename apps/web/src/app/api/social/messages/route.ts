import { NextResponse } from 'next/server';
import { getMessagesFor, addMessage } from '@/lib/socialMock';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user = url.searchParams.get('user');
  if (!user) return NextResponse.json({ error: 'user required' }, { status: 400 });
  const msgs = getMessagesFor(user);
  return NextResponse.json({ data: msgs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { from, to, text } = body;
    if (!from || !to || !text) return NextResponse.json({ error: 'from,to,text required' }, { status: 400 });
    const m = addMessage(from, to, text);
    return NextResponse.json({ data: m }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
}
