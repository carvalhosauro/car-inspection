import { describe, it, expect, vi } from "vitest";
import { requireRole } from "./require-role.js";
import { AppError } from "../errors/app-error.js";

function fakeReq(role: string) {
  return { ctx: { userId: "u", tenantId: "t", role } } as never;
}

describe("requireRole", () => {
  it("allows a permitted role", async () => {
    const handler = requireRole(["gestor", "supervisor"]);
    await expect(handler(fakeReq("gestor"), {} as never)).resolves.toBeUndefined();
  });

  it("throws forbidden for a disallowed role", async () => {
    const handler = requireRole(["gestor"]);
    await expect(handler(fakeReq("vistoriador"), {} as never)).rejects.toBeInstanceOf(AppError);
  });

  it("the thrown error is a 403", async () => {
    const handler = requireRole(["superadmin"]);
    try {
      await handler(fakeReq("gestor"), {} as never);
      throw new Error("should have thrown");
    } catch (e) {
      expect((e as AppError).status).toBe(403);
    }
  });
});
