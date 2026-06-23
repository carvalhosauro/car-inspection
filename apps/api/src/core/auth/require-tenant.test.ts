import { describe, it, expect } from "vitest";
import { requireTenant } from "./require-tenant.js";
import { AppError } from "../errors/app-error.js";

function fakeReq(tenantId: string | null) {
  return { ctx: { userId: "u", tenantId, role: "gestor" } } as never;
}

describe("requireTenant", () => {
  it("returns tenantId when it is a non-null string", () => {
    expect(requireTenant(fakeReq("tenant-abc"))).toBe("tenant-abc");
  });

  it("throws badRequest when tenantId is null", () => {
    expect(() => requireTenant(fakeReq(null))).toThrow(AppError);
  });

  it("the thrown error has statusCode 400", () => {
    try {
      requireTenant(fakeReq(null));
      throw new Error("should have thrown");
    } catch (e) {
      expect((e as AppError).status).toBe(400);
    }
  });

  it("the thrown error message contains 'tenant'", () => {
    try {
      requireTenant(fakeReq(null));
      throw new Error("should have thrown");
    } catch (e) {
      expect((e as AppError).message).toContain("tenant");
    }
  });
});
