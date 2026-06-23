import type { ConnectionOptions } from "tls";

export function isLocalDatabaseUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/.test(url);
}

/** Supabase / cloud Postgres need TLS; local Supabase CLI does not. */
export function getPgSslConfig(url: string): false | ConnectionOptions {
  return isLocalDatabaseUrl(url) ? false : { rejectUnauthorized: false };
}

/** Avoid pg v8 warnings when sslmode=require is present in the URL. */
export function stripSslQueryParams(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("uselibpqcompat");
    const query = parsed.searchParams.toString();
    const base = `${parsed.protocol}//${parsed.username ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ""}@` : ""}${parsed.host}${parsed.pathname}`;
    return query ? `${base}?${query}` : base;
  } catch {
    return url;
  }
}

export function createPgPoolConfig(url: string, max: number) {
  return {
    connectionString: stripSslQueryParams(url),
    max,
    ssl: getPgSslConfig(url),
  };
}
