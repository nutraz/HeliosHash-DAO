'use client';
import { reactQueryConfig } from '@/config/reactQueryConfig';
import { ReactQueryDevtoolsDynamic } from '@/hooks/useReactQueryDevtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Singleton query client (module scope). Avoid re-creating each render.
const queryClient = new QueryClient({
  defaultOptions: reactQueryConfig.defaultOptions,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtoolsDynamic
        initialIsOpen={reactQueryConfig.devtools.initialIsOpen}
        position={reactQueryConfig.devtools.position}
        buttonPosition={reactQueryConfig.devtools.buttonPosition}
      />
    </QueryClientProvider>
  );
}

export { queryClient };
