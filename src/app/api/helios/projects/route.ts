import { NextResponse } from 'next/server';
import { getServerContext, getProjects } from '../../../../lib/dfinity';

export async function GET() {
  try {
    // For public data, prefer using a server identity so we can call canisters
    // without requiring the user's browser to authenticate.
    const serverCtx = await getServerContext();
    const projects = await getProjects(serverCtx ?? null);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('API Error (projects):', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
