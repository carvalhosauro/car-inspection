import { z } from "zod";
import type { UserRole } from "@vistoria/contracts";

export const SESSION_COOKIE = "vistoria_session";

export interface WebSession {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  tenantId: string | null;
}

const WebSessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  role: z.enum(["superadmin", "gestor", "supervisor", "vistoriador"]),
  tenantId: z.string().nullable(),
});

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
    const result = WebSessionSchema.safeParse(JSON.parse(json));
    if (!result.success) {
      console.debug("[session] decode error:", result.error);
      return null;
    }
    return result.data as WebSession;
  } catch (err) {
    console.debug("[session] decode error:", err);
    return null;
  }
}
