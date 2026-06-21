import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createApiClient, type ApiClient } from "@vistoria/api-client";
import type { LoginInput } from "@vistoria/contracts";
import { getApiBaseUrl } from "@/lib/env";
import {
  saveRefreshToken,
  getRefreshToken,
  clearRefreshToken,
} from "@/lib/secure-token-store";
import { getAccess, setAccess } from "./token-memory";
import { ensureFreshAccess } from "./refresh";

interface AuthValue {
  isAuthenticated: boolean;
  bootstrapped: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  client: ApiClient;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthed] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  // One stable api-client; getToken ONLY reads the in-memory access token.
  // It never refreshes here → no recursion (refresh runs via the bare client
  // in auth/refresh.ts, triggered by bootstrap and React Query's 401 handler).
  const client = useMemo<ApiClient>(
    () => createApiClient(getApiBaseUrl(), () => getAccess()),
    [],
  );

  // On launch, try to restore a session from the stored refresh token.
  useEffect(() => {
    void (async () => {
      const rt = await getRefreshToken();
      if (rt) {
        const ok = await ensureFreshAccess();
        setAuthed(ok);
      }
      setBootstrapped(true);
    })();
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const pair = await client.auth.login(input);
      await saveRefreshToken(pair.refreshToken);
      setAccess(pair.accessToken);
      setAuthed(true);
    },
    [client],
  );

  const logout = useCallback(async () => {
    await clearRefreshToken();
    setAccess(null);
    setAuthed(false);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ isAuthenticated, bootstrapped, login, logout, client }),
    [isAuthenticated, bootstrapped, login, logout, client],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
