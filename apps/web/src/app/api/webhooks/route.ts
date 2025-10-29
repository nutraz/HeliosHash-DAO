// Stub for webhooks API route
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // TODO: Handle webhook events
  return NextResponse.json({ received: true });
}
