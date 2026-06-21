import { useAuth } from "@/auth/auth-context";
import type { ApiClient } from "@vistoria/api-client";

/** Returns the auth-bound ApiClient created once in AuthProvider. */
export function useApiClient(): ApiClient {
  return useAuth().client;
}
