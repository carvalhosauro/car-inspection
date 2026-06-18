import { createSigner, createVerifier } from "fast-jwt";
import { jwtPayload, type JwtPayload } from "@vistoria/contracts";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

export function signAccess(payload: JwtPayload, secret: string): string {
  const sign = createSigner({ key: secret, expiresIn: ttlToMs(ACCESS_TTL) });
  return sign({ sub: payload.sub, tenantId: payload.tenantId, role: payload.role });
}

export function signRefresh(payload: JwtPayload, secret: string): string {
  const sign = createSigner({ key: secret, expiresIn: ttlToMs(REFRESH_TTL) });
  return sign({ sub: payload.sub, tenantId: payload.tenantId, role: payload.role });
}

export function verifyAccess(token: string, secret: string): JwtPayload {
  return verify(token, secret);
}

export function verifyRefresh(token: string, secret: string): JwtPayload {
  return verify(token, secret);
}

function verify(token: string, secret: string): JwtPayload {
  const v = createVerifier({ key: secret });
  const raw = v(token) as Record<string, unknown>;
  return jwtPayload.parse({
    sub: raw.sub,
    tenantId: raw.tenantId ?? null,
    role: raw.role,
  });
}

function ttlToMs(ttl: string): number {
  const unit = ttl.slice(-1);
  const n = Number(ttl.slice(0, -1));
  if (unit === "m") return n * 60_000;
  if (unit === "d") return n * 86_400_000;
  throw new Error(`Unsupported ttl: ${ttl}`);
}
