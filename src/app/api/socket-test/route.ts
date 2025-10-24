import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const test = searchParams.get('test');
  try {
    if (test === 'ping') {
      return NextResponse.json({
        status: 'ok',
        message: 'Socket.IO connectivity test',
        socket: {
          connected: true,
          port: process.env.PORT || 3001,
          timestamp: new Date().toISOString(),
        },
      });
    }
    return NextResponse.json({
      status: 'error',
      message: 'Socket.IO test endpoint - add ?test=ping',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Socket.IO test failed',
        error: err?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
