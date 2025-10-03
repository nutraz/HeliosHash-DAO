import { getCanisterIdResolutions } from '@/lib/canisterIds';
import { getHealthSnapshot } from '@/services/healthService';
import { NextResponse } from 'next/server';

export const revalidate = 0; // always fresh

export async function GET() {
  try {
    const [healthSnapshot, resolutions] = await Promise.all([
      getHealthSnapshot(),
      Promise.resolve(getCanisterIdResolutions()),
    ]);

    const responseData = {
      status: 'ok',
      timestamp: healthSnapshot.generatedAt,
      build: {
        commit: 'dev',
        branch: 'local',
        timestamp: Date.now().toString(),
      },
      version: {
        app: '0.1.0',
        canisters: {
          hhdao_dao: '0.1.0', // Placeholder
        },
      },
      metrics: {
        uptimeMs: 0, // Placeholder
        uptimeSeconds: 0, // Placeholder
        activeUsers24h: 0, // Placeholder
        requestCount: 0, // Placeholder
        errorRate: 0, // Placeholder
      },
      ...healthSnapshot,
      resolutions,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: Date.now(),
        error: e?.message || 'Failed to generate health snapshot',
      },
      { status: 500 }
    );
  }
}
