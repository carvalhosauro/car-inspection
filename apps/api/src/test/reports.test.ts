import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildTestApp, seedTenant, authHeader } from "./helpers";
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

describe("reports", () => {
  it("summary returns inspection counts by status", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/summary",
      headers: authHeader(gestor),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty("byStatus");
    expect(res.json()).toHaveProperty("total");
  });

  it("damages-by-vehicle returns rows", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/damages-by-vehicle",
      headers: authHeader(gestor),
    });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json().items)).toBe(true);
  });

  it("pending-by-inspector returns rows", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/pending-by-inspector",
      headers: authHeader(gestor),
    });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json().items)).toBe(true);
  });

  it("avg-inspection-time returns a number or null", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/avg-inspection-time",
      headers: authHeader(gestor),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty("avgSeconds");
  });

  it("forbids a vistoriador from reading reports (403)", async () => {
    const { users } = await seedTenant(["vistoriador"]);
    const res = await app.inject({
      method: "GET",
      url: "/v1/reports/summary",
      headers: authHeader(users.vistoriador as { id: string; tenantId: string | null; role: "vistoriador" }),
    });
    expect(res.statusCode).toBe(403);
  });
});
