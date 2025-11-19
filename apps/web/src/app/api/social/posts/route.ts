import { NextResponse } from 'next/server';
import { getFeed, addPost } from '@/lib/socialMock';

export async function GET() {
  const feed = getFeed();
  return NextResponse.json({ data: feed });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorHandle, content } = body;
    if (!authorHandle || !content) return NextResponse.json({ error: 'authorHandle and content required' }, { status: 400 });
    const p = addPost(authorHandle, content);
    return NextResponse.json({ data: p }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
}
