import { NextRequest, NextResponse } from 'next/server';

// Server-friendly login helper. The Internet Identity login flow must be initiated
// by the browser (AuthClient). This endpoint returns the derivation origin and
// a friendly message for the client to call `AuthClient.login(...)` directly.

export async function POST(request: NextRequest) {
  try {
    const derivationOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

    return NextResponse.json({
      success: true,
      origin: derivationOrigin,
      message: 'Call AuthClient.login() in the browser using the provided origin.'
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, error: 'Server error preparing login' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
