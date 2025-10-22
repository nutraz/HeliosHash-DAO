import { useEffect, useState } from 'react';

export interface ConnectivityResult {
  server: boolean;
  api: boolean;
  socket: boolean;
  port: string;
  ip: string;
  message: string;
}

export async function checkConnectivity(): Promise<ConnectivityResult> {
  const port = process.env.PORT || '3001';
  try {
    const serverResp = await fetch(`http://localhost:${port}`, { method: 'HEAD' });
    const apiResp = await fetch(`http://localhost:${port}/api/status`);
    const apiJson: any = await apiResp.json().catch(() => ({}));

    let socketConnected = false;
    try {
      const socketResp = await fetch(`http://localhost:${port}/api/socket-test?test=ping`);
      const socketJson: any = await socketResp.json().catch(() => ({}));
      socketConnected = socketJson.status === 'ok';
    } catch {}

    return {
      server: serverResp.ok,
      api: apiResp.ok,
      socket: socketConnected,
      port: String(port),
      ip: apiJson.ip || 'localhost',
      message: apiJson.message || 'Server is running',
    };
  } catch (error: any) {
    return {
      server: false,
      api: false,
      socket: false,
      port: String(process.env.PORT || '3001'),
      ip: 'localhost',
      message: error?.message || 'Connectivity check failed',
    };
  }
}

export function useConnectivity(intervalMs = 30000) {
  const [connectivity, setConnectivity] = useState<ConnectivityResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const runCheck = async () => {
      setLoading(true);
      const result = await checkConnectivity();
      if (!cancelled) {
        setConnectivity(result);
        setLoading(false);
      }
    };
    runCheck();
    const id = setInterval(runCheck, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return { connectivity, loading };
}
