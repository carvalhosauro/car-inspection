import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { ApiError } from "@vistoria/api-client";
import { ensureFreshAccess } from "@/auth/refresh";

function isUnauthorized(err: unknown): boolean {
  return err instanceof ApiError && err.status === 401;
}

// React-on-401: when a request 401s, refresh the access token once (singleton),
// then refetch queries. The refresh goes through a bare client (see auth/refresh.ts),
// so it never re-enters the authenticated getToken.
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      if (isUnauthorized(err)) {
        void ensureFreshAccess().then((ok) => {
          if (ok) void queryClient.invalidateQueries();
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      if (isUnauthorized(err)) void ensureFreshAccess();
    },
  }),
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
    // one bounded retry on 401 so the retried mutation carries the refreshed token
    mutations: { retry: (n, e) => n < 1 && isUnauthorized(e) },
  },
});
