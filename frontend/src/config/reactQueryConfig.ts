export const reactQueryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
  devtools: {
    initialIsOpen: false,
    position: 'bottom-right' as const,
    buttonPosition: 'bottom-right' as const,
  },
} as const;

export type ReactQueryConfig = typeof reactQueryConfig;
