import { NextResponse } from 'next/server';
import { sendTokens, getTxs } from '@/lib/mockServer';

export async function GET() {
  const txs = getTxs();
  return NextResponse.json({ ok: txs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.to || typeof body.amount !== 'number') {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
    }
    const result = sendTokens(body.to, body.amount);
    return NextResponse.json({ ok: result });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
