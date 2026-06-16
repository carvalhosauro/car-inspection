import { describe, it, expect } from "vitest";
import { signAccess, signRefresh, verifyAccess, verifyRefresh } from "./tokens";

const SECRETS = { access: "access-secret", refresh: "refresh-secret" };
const payload = {
  sub: "00000000-0000-7000-8000-000000000001",
  tenantId: "00000000-0000-7000-8000-0000000000aa",
  role: "gestor" as const,
};

describe("tokens", () => {
  it("signs and verifies an access token preserving the payload", () => {
    const token = signAccess(payload, SECRETS.access);
    const decoded = verifyAccess(token, SECRETS.access);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.tenantId).toBe(payload.tenantId);
    expect(decoded.role).toBe("gestor");
  });

  it("verifyAccess rejects a token signed with the refresh secret", () => {
    const token = signRefresh(payload, SECRETS.refresh);
    expect(() => verifyAccess(token, SECRETS.access)).toThrow();
  });

  it("verifyRefresh accepts a refresh token", () => {
    const token = signRefresh(payload, SECRETS.refresh);
    const decoded = verifyRefresh(token, SECRETS.refresh);
    expect(decoded.sub).toBe(payload.sub);
  });

  it("rejects a token whose payload fails JwtPayload validation", () => {
    const token = signAccess(
      { sub: "not-a-uuid", tenantId: null, role: "gestor" },
      SECRETS.access,
    );
    expect(() => verifyAccess(token, SECRETS.access)).toThrow();
  });
});
