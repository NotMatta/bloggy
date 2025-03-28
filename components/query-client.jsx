"use client"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { persistQueryClient, PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined
})

persistQueryClient({
  queryClient,
  persister
});

const QueryProvider = ({ children }) => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{persister}}>
      {children}
    </PersistQueryClientProvider>
  );
}

export { QueryProvider as QueryClientProvider};
