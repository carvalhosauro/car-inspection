import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password.js";

describe("password", () => {
  it("hashes and verifies a correct password", async () => {
    const hash = await hashPassword("senha123");
    expect(hash).not.toBe("senha123");
    expect(await verifyPassword(hash, "senha123")).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await hashPassword("senha123");
    expect(await verifyPassword(hash, "errada")).toBe(false);
  });

  it("returns false for a malformed hash instead of throwing", async () => {
    expect(await verifyPassword("not-a-hash", "senha123")).toBe(false);
  });
});
