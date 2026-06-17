import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildTestApp, seedTenant, authHeader } from "./helpers.js";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let superadmin: { id: string; tenantId: string | null; role: "superadmin" };
let gestor: { id: string; tenantId: string | null; role: "gestor" };

beforeAll(async () => {
  app = await buildTestApp();
  superadmin = (await seedTenant(["superadmin"])).users.superadmin as typeof superadmin;
  gestor = (await seedTenant(["gestor"])).users.gestor as typeof gestor;
});

afterAll(async () => {
  await app.close();
});

describe("tenants", () => {
  it("superadmin creates a tenant + first gestor in one call", async () => {
    const slug = `loc-${Date.now()}`;
    const res = await app.inject({
      method: "POST",
      url: "/v1/tenants",
      headers: authHeader(superadmin),
      payload: {
        name: "Locadora X",
        slug,
        gestor: { name: "Gestor X", email: `gx-${Date.now()}@test.dev`, password: "senha123" },
      },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().slug).toBe(slug);
    expect(res.json().id).toBeTypeOf("string");
  });

  it("forbids a non-superadmin from creating tenants (403)", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/tenants",
      headers: authHeader(gestor),
      payload: {
        name: "Nope",
        slug: `nope-${Date.now()}`,
        gestor: { name: "g", email: `n-${Date.now()}@test.dev`, password: "senha123" },
      },
    });
    expect(res.statusCode).toBe(403);
  });

  it("superadmin lists tenants", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/tenants",
      headers: authHeader(superadmin),
    });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json().items)).toBe(true);
  });
});
