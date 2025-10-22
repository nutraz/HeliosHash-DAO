import { NextResponse } from 'next/server';

// Status endpoint for health checks and monitoring
export async function GET() {
  try {
    const uptimeMs = process.uptime() * 1000;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);

    // Mock data for now - in production this would come from actual metrics
    const statusData = {
      status: 'healthy',
      timestamp: Date.now(),
      build: {
        commit: process.env.GIT_COMMIT || 'unknown',
        branch: process.env.GIT_BRANCH || 'main',
        timestamp: new Date().toISOString(),
      },
      version: {
        app: process.env.npm_package_version || '1.0.0',
        canisters: {
          hhdao: '1.0.0',
          governance: '1.0.0',
          treasury: '1.0.0',
        },
      },
      metrics: {
        uptimeMs,
        uptimeSeconds,
        activeUsers24h: 0, // Mock - would be from database
        requestCount: 0, // Mock - would be from monitoring
        errorRate: 0, // Mock - would be from monitoring
      },
    };

    return NextResponse.json(statusData);
  } catch (error) {
    console.error('Status endpoint error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
