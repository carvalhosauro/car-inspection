import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";

vi.mock("../core/storage/index", () => ({
  signUploadUrl: vi.fn(async (filePath: string) => ({
    filePath,
    signedUrl: `http://storage.test/upload/${filePath}`,
    token: "signed-token",
  })),
  downloadBytes: vi.fn(),
}));

import { buildTestApp, seedTenant, authHeader } from "./helpers";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let vistoriador: { id: string; tenantId: string | null; role: "vistoriador" };

beforeAll(async () => {
  app = await buildTestApp();
  vistoriador = (await seedTenant(["vistoriador"])).users.vistoriador as typeof vistoriador;
});

afterAll(async () => {
  await app.close();
});

describe("uploads", () => {
  it("returns a signed upload URL for a generated path", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/uploads/sign",
      headers: authHeader(vistoriador),
      payload: { contentType: "image/jpeg" },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().filePath).toContain(vistoriador.tenantId);
    expect(res.json().signedUrl).toContain("http://storage.test/upload/");
    expect(res.json().token).toBe("signed-token");
  });

  it("rejects an unauthenticated request", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/uploads/sign",
      payload: { contentType: "image/jpeg" },
    });
    expect(res.statusCode).toBe(401);
  });
});
