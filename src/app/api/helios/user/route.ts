import { NextResponse } from 'next/server';
import { connectToCanisters, getUserData } from '../../../../lib/dfinity';

const MOCK_USER = {
  name: 'Development User',
  principal: 'dev-user-123',
  provider: 'dev',
  pfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
  rank: 'Dev Tester',
  tokenBalance: 25000,
  stats: { projectsStarted: 5, projectsHelped: 15, membersAdded: 32 },
  _source: 'dev'
};

export async function GET(request: Request) {
  try {
    const connection = await connectToCanisters();

    const devHeader = request.headers.get('x-dev-auth') === 'true';
    const devEnv = process.env.NEXT_PUBLIC_DEV_MODE === 'true' || process.env.NODE_ENV === 'development';

    // If we don't have a connection but dev mode is enabled, return a mock user for local development
    if (!connection && (devHeader || devEnv)) {
      // eslint-disable-next-line no-console
      console.log('🔧 Development authentication accepted (no connection)');
      return NextResponse.json(MOCK_USER);
    }

    if (!connection) {
      // Not authenticated / no canister connection — return 401 so client can fallback
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // If real canister implementation exists, getUserData can accept the connection
    const user = await getUserData();

    // If canister returned nothing and we're in dev, return a mock user
    if (!user && (devHeader || devEnv)) {
      // eslint-disable-next-line no-console
      console.log('🔧 Development authentication accepted (canister returned no user)');
      return NextResponse.json(MOCK_USER);
    }

    return NextResponse.json(user ?? {});
  } catch (error) {
    console.error('API Error (user):', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
