import { NextRequest, NextResponse } from 'next/server';

// Simple sandbox verifier - replace with real UIDAI call in production
async function callUidaiSandbox(payload: { name: string; aadhaar: string }) {
  // Simulate network delay & verification rules:
  await new Promise(r => setTimeout(r, 300));
  const last4 = payload.aadhaar.replace(/\D/g, '').slice(-4);
  if (!last4 || last4.length !== 4) {
    return { status: 'error', error: 'Invalid Aadhaar format' };
  }
  // sandbox rule: if last digit even → verified; odd → fail (deterministic)
  const verified = parseInt(last4.slice(-1), 10) % 2 === 0;
  return {
    status: verified ? 'ok' : 'fail',
    verificationId: `sandbox-${Date.now()}-${last4}`,
    verified,
  };
}

export async function POST(request: NextRequest) {
  try {
    // CSRF protection
    const { validateOrigin } = await import('@/lib/middleware/csrf');
    if (!validateOrigin(request)) {
      return NextResponse.json({ status: 'error', error: 'Invalid origin' }, { status: 403 });
    }
    // Rate limiting
    const { rateLimit } = await import('@/lib/middleware/rateLimit');
    const rateLimitResponse = rateLimit(request, 5, 60000); // 5 req/min
    if (rateLimitResponse) return rateLimitResponse;
    const { KycSchema } = await import('@/lib/validation/schemas');
    const body = await request.json();
    const validation = KycSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ status: 'error', error: validation.error.issues }, { status: 400 });
    }
    const { name, aadhaar } = validation.data;

  // Masking can be used for logs or storage if needed
  // const masked = aadhaar.replace(/\d(?=\d{4})/g, '*');

    // Call sandboxed verifier
    const resp = await callUidaiSandbox({ name, aadhaar });

    if (resp.status === 'ok') {
      // In production: persist verification to canister or secure DB
      return NextResponse.json({ status: 'ok', verificationId: resp.verificationId });
    } else if (resp.status === 'fail') {
      return NextResponse.json({ status: 'fail', verificationId: resp.verificationId }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'error', error: resp.error || 'verification failed' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ status: 'error', error: 'server error' }, { status: 500 });
  }
}
