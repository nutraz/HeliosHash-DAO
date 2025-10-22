'use client';
import { useEffect, useState } from 'react';

interface DevtoolsProps {
  initialIsOpen?: boolean;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  buttonPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  enabledParamKey?: string; // URL param key to force-enable devtools
}

export function ReactQueryDevtoolsDynamic({
  initialIsOpen = false,
  position = 'bottom-right',
  buttonPosition = 'bottom-right',
  enabledParamKey = 'devtools',
}: DevtoolsProps) {
  const [Devtools, setDevtools] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const forced = params.get(enabledParamKey) === 'true';
    if (process.env.NODE_ENV !== 'development' && !forced) return;
    let cancelled = false;
    import('@tanstack/react-query-devtools')
      .then((mod) => {
        if (!cancelled) setDevtools(() => mod.ReactQueryDevtools as any);
      })
      .catch((e) => console.warn('[ReactQueryDevtoolsDynamic] failed to load:', e));
    return () => {
      cancelled = true;
    };
  }, [enabledParamKey]);

  if (!Devtools) return null;
  return (
    <Devtools initialIsOpen={initialIsOpen} position={position} buttonPosition={buttonPosition} />
  );
}
