import { createApiClient } from "@vistoria/api-client";
import { getApiBaseUrl } from "@/lib/env";
import { getRefreshToken, clearRefreshToken } from "@/lib/secure-token-store";
import { setAccess } from "./token-memory";

// Lazily built so importing this module never triggers env reads at load time.
// getToken returns null → the refresh request carries no auth header and never
// re-enters the authenticated getToken (no recursion).
let bare: ReturnType<typeof createApiClient> | null = null;
function bareClient() {
  return (bare ??= createApiClient(getApiBaseUrl(), () => null));
}

let inFlight: Promise<boolean> | null = null;

/**
 * Mint a fresh access token from the stored refresh token. Concurrent callers share
 * one in-flight request (no refresh stampede). Returns true on success; on failure
 * clears tokens (caller redirects to /login).
 */
export function ensureFreshAccess(): Promise<boolean> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const rt = await getRefreshToken();
      if (!rt) return false;
      const { accessToken } = await bareClient().auth.refresh(rt);
      setAccess(accessToken);
      return true;
    } catch {
      await clearRefreshToken();
      setAccess(null);
      return false;
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}
