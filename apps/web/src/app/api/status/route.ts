// API route for status (migrated from pages/api/status.ts)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
