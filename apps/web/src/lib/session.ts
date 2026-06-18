import type { UserRole } from "@vistoria/contracts";

export const SESSION_COOKIE = "vistoria_session";

export interface WebSession {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  tenantId: string | null;
}

const WEB_ROLES: ReadonlySet<UserRole> = new Set<UserRole>([
  "superadmin",
  "gestor",
  "supervisor",
]);

export function isWebRoleAllowed(role: UserRole): boolean {
  return WEB_ROLES.has(role);
}

/** Base64url-encodes the session JSON so it fits in one cookie value. */
export function encodeSession(session: WebSession): string {
  const json = JSON.stringify(session);
  return Buffer.from(json, "utf8").toString("base64url");
}

export function decodeSession(value: string | undefined | null): WebSession | null {
  if (!value) return null;
  try {
    const json = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as Partial<WebSession>;
    if (
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.role !== "string"
    ) {
      return null;
    }
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      role: parsed.role as UserRole,
      tenantId: parsed.tenantId ?? null,
    };
  } catch {
    return null;
  }
}
