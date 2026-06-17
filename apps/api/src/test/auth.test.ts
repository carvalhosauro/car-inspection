import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildTestApp, seedTenant, authHeader } from "./helpers";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let gestorEmail: string;
let gestor: { id: string; tenantId: string | null; role: "gestor" };

beforeAll(async () => {
  app = await buildTestApp();
  const seeded = await seedTenant(["gestor"]);
  gestor = seeded.users.gestor as typeof gestor;
  gestorEmail = `gestor-${gestor.id.replace(/-/g, "")}@test.dev`;
});

afterAll(async () => {
  await app.close();
});

describe("auth", () => {
  it("logs in with correct credentials and returns a token pair", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: gestorEmail, password: "senha123" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().accessToken).toBeTypeOf("string");
    expect(res.json().refreshToken).toBeTypeOf("string");
  });

  it("rejects a wrong password with 401", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: gestorEmail, password: "errada" },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().code).toBe("unauthorized");
  });

  it("refresh issues a new access token", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: gestorEmail, password: "senha123" },
    });
    const { refreshToken } = login.json();
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/refresh",
      payload: { refreshToken },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().accessToken).toBeTypeOf("string");
  });

  it("me returns the logged-in user", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/auth/me",
      headers: authHeader(gestor),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().id).toBe(gestor.id);
    expect(res.json().role).toBe("gestor");
  });

  it("logout returns 204", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: gestorEmail, password: "senha123" },
    });
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/logout",
      headers: { authorization: `Bearer ${login.json().accessToken}` },
    });
    expect(res.statusCode).toBe(204);
  });
});
