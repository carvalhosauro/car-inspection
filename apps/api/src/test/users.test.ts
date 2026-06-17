import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildTestApp, seedTenant, authHeader } from "./helpers.js";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let gestor: { id: string; tenantId: string | null; role: "gestor" };

beforeAll(async () => {
  app = await buildTestApp();
  gestor = (await seedTenant(["gestor"])).users.gestor as typeof gestor;
});

afterAll(async () => {
  await app.close();
});

describe("users", () => {
  it("gestor creates a vistoriador in their tenant", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/users",
      headers: authHeader(gestor),
      payload: {
        name: "Insp 1",
        email: `insp-${Date.now()}@test.dev`,
        password: "senha123",
        role: "vistoriador",
      },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().role).toBe("vistoriador");
    expect(res.json().tenantId).toBe(gestor.tenantId);
  });

  it("lists users in the tenant", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/users",
      headers: authHeader(gestor),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().items.length).toBeGreaterThanOrEqual(1);
  });

  it("updates a user's name", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/users",
      headers: authHeader(gestor),
      payload: {
        name: "Old",
        email: `upd-${Date.now()}@test.dev`,
        password: "senha123",
        role: "supervisor",
      },
    });
    const id = created.json().id;
    const res = await app.inject({
      method: "PATCH",
      url: `/v1/users/${id}`,
      headers: authHeader(gestor),
      payload: { name: "New" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().name).toBe("New");
  });

  it("soft-deletes a user (active=false) and returns 204", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/users",
      headers: authHeader(gestor),
      payload: {
        name: "Del",
        email: `del-${Date.now()}@test.dev`,
        password: "senha123",
        role: "vistoriador",
      },
    });
    const id = created.json().id;
    const res = await app.inject({
      method: "DELETE",
      url: `/v1/users/${id}`,
      headers: authHeader(gestor),
    });
    expect(res.statusCode).toBe(204);
  });
});
