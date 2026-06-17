import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildTestApp, seedTenant, authHeader } from "./helpers";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let supervisor: { id: string; tenantId: string | null; role: "supervisor" };

beforeAll(async () => {
  app = await buildTestApp();
  supervisor = (await seedTenant(["supervisor"])).users.supervisor as typeof supervisor;
});

afterAll(async () => {
  await app.close();
});

describe("vehicles", () => {
  it("creates a vehicle", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/vehicles",
      headers: authHeader(supervisor),
      payload: { plate: `ABC1D${Date.now() % 100}`, model: "Onix", currentKm: 1000 },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().model).toBe("Onix");
    expect(res.json().currentKm).toBe(1000);
  });

  it("gets a vehicle by id", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/vehicles",
      headers: authHeader(supervisor),
      payload: { plate: `XYZ9K${Date.now() % 100}`, model: "HB20" },
    });
    const id = created.json().id;
    const res = await app.inject({
      method: "GET",
      url: `/v1/vehicles/${id}`,
      headers: authHeader(supervisor),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().id).toBe(id);
  });

  it("updates a vehicle km", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/vehicles",
      headers: authHeader(supervisor),
      payload: { plate: `KMK1K${Date.now() % 100}`, model: "Gol" },
    });
    const id = created.json().id;
    const res = await app.inject({
      method: "PATCH",
      url: `/v1/vehicles/${id}`,
      headers: authHeader(supervisor),
      payload: { currentKm: 5000 },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().currentKm).toBe(5000);
  });

  it("soft-deletes a vehicle and returns 204", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/vehicles",
      headers: authHeader(supervisor),
      payload: { plate: `DEL1D${Date.now() % 100}`, model: "Ka" },
    });
    const id = created.json().id;
    const res = await app.inject({
      method: "DELETE",
      url: `/v1/vehicles/${id}`,
      headers: authHeader(supervisor),
    });
    expect(res.statusCode).toBe(204);
  });

  it("lists vehicles with a page shape", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/vehicles",
      headers: authHeader(supervisor),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty("items");
    expect(res.json()).toHaveProperty("nextCursor");
  });
});
