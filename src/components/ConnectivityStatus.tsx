'use client';
import { useConnectivity } from '@/lib/connectivity';

// Fall back badges/cards if shadcn UI components are not present
// Attempt to import dynamically; otherwise simple divs.
let Card: any = ({ children, className = '' }: any) => (
  <div className={`border rounded-md p-4 bg-gray-800/40 ${className}`}>{children}</div>
);
let CardHeader: any = ({ children }: any) => <div className='mb-2'>{children}</div>;
let CardTitle: any = ({ children }: any) => (
  <h3 className='text-lg font-semibold text-white'>{children}</h3>
);
let CardDescription: any = ({ children }: any) => (
  <p className='text-sm text-gray-400'>{children}</p>
);
let CardContent: any = ({ children, className = '' }: any) => (
  <div className={className}>{children}</div>
);
let Badge: any = ({ children, variant }: any) => (
  <span
    className={`inline-block px-2 py-0.5 text-xs rounded ${
      variant === 'destructive' ? 'bg-red-600' : 'bg-green-600'
    } text-white`}
  >
    {children}
  </span>
);

try {
  // If design system components exist, override fallbacks
  // @ts-ignore
  const ui = require('@/components/ui/card');
  if (ui.Card) Card = ui.Card;
  if (ui.CardHeader) CardHeader = ui.CardHeader;
  if (ui.CardTitle) CardTitle = ui.CardTitle;
  if (ui.CardDescription) CardDescription = ui.CardDescription;
  if (ui.CardContent) CardContent = ui.CardContent;
  // @ts-ignore
  const badge = require('@/components/ui/badge');
  if (badge.Badge) Badge = badge.Badge;
} catch {}

const StatusBadge = ({ ok }: { ok: boolean }) => (
  <Badge variant={ok ? 'default' : 'destructive'}>{ok ? 'Connected' : 'Down'}</Badge>
);

export function ConnectivityStatus() {
  const { connectivity, loading } = useConnectivity();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connectivity Status</CardTitle>
          <CardDescription>Checking connectivity...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-gray-400'>Please wait…</div>
        </CardContent>
      </Card>
    );
  }

  if (!connectivity) {
    return (
      <Card className='border-red-500/40'>
        <CardHeader>
          <CardTitle>Connectivity Error</CardTitle>
          <CardDescription>Unable to determine connectivity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-red-400'>No data returned.</div>
        </CardContent>
      </Card>
    );
  }

  const { server, api, socket, port, ip, message } = connectivity;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connectivity Status</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-3 gap-4 text-sm'>
          <div>
            <div className='text-gray-400'>Server</div>
            <div className='flex items-center gap-2 mt-1'>
              <StatusBadge ok={server} />
              <span className='text-gray-200'>:{port}</span>
            </div>
          </div>
          <div>
            <div className='text-gray-400'>API</div>
            <div className='flex items-center gap-2 mt-1'>
              <StatusBadge ok={api} />
              <span className='text-gray-200'>/api/status</span>
            </div>
          </div>
          <div>
            <div className='text-gray-400'>Socket.IO</div>
            <div className='flex items-center gap-2 mt-1'>
              <StatusBadge ok={socket} />
              <span className='text-gray-200'>/api/socketio</span>
            </div>
          </div>
        </div>
        <div className='text-xs text-gray-400 space-y-1'>
          <div>Local: http://localhost:{port}</div>
          {ip && ip !== 'localhost' && (
            <div>
              Network: http://{ip}:{port}
            </div>
          )}
          <div className='text-gray-500'>Updates every 30s</div>
        </div>
      </CardContent>
    </Card>
  );
}
