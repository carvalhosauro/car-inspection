import { describe, it, expect } from "vitest";
import {
  SESSION_COOKIE,
  encodeSession,
  decodeSession,
  isWebRoleAllowed,
} from "./session";

describe("session helper", () => {
  it("exposes a fixed cookie name", () => {
    expect(SESSION_COOKIE).toBe("vistoria_session");
  });

  it("round-trips a session payload", () => {
    const value = encodeSession({
      accessToken: "a.b.c",
      refreshToken: "r.e.f",
      role: "gestor",
      tenantId: "00000000-0000-7000-8000-000000000001",
    });
    const decoded = decodeSession(value);
    expect(decoded?.accessToken).toBe("a.b.c");
    expect(decoded?.role).toBe("gestor");
  });

  it("returns null for garbage cookie values", () => {
    expect(decodeSession("not-base64-json")).toBeNull();
    expect(decodeSession(undefined)).toBeNull();
  });

  it("allows web roles and rejects vistoriador", () => {
    expect(isWebRoleAllowed("superadmin")).toBe(true);
    expect(isWebRoleAllowed("gestor")).toBe(true);
    expect(isWebRoleAllowed("supervisor")).toBe(true);
    expect(isWebRoleAllowed("vistoriador")).toBe(false);
  });
});
