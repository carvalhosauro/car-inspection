let accessToken: string | null = null;

/** The current in-memory access token (or null). Read by createApiClient's getToken. */
export function getAccess(): string | null {
  return accessToken;
}

/** Set/clear the in-memory access token (login, refresh, logout). */
export function setAccess(token: string | null): void {
  accessToken = token;
}
