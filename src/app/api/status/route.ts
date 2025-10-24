import { getCanisterIdResolutions } from '@/lib/canisterIds';
import { getHealthSnapshot } from '@/services/healthService';
import { NextResponse } from 'next/server';

export const revalidate = 0; // always fresh

export async function GET() {
  try {
    const [snapshot, resolutions] = await Promise.all([
      getHealthSnapshot(),
      Promise.resolve(getCanisterIdResolutions()),
    ]);
    return NextResponse.json({ ...snapshot, resolutions }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Failed to generate health snapshot' },
      { status: 500 }
    );
  }
}
