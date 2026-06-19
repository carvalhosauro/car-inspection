import { QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME_MS = 30_000;

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: QUERY_STALE_TIME_MS, retry: 1, refetchOnWindowFocus: false },
    },
  });
}
