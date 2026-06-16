import { describe, it, expect } from "vitest";
import Fastify from "fastify";
import { sql } from "drizzle-orm";
import { signAccess } from "./tokens";
import { authContextPlugin } from "./auth-context";
import { errorHandler } from "../errors/error-handler";

const SECRET = "test-access-secret";

async function buildMini() {
  const app = Fastify();
  app.setErrorHandler(errorHandler);
  await app.register(authContextPlugin, {
    accessSecret: SECRET,
    publicRoutes: ["/v1/auth/login", "/v1/auth/refresh"],
  });
  app.get("/v1/ping", async (request) => {
    const r = await request.tx.execute(
      sql`SELECT current_setting('app.tenant_id', true) AS tid, current_setting('app.role', true) AS role`,
    );
    const row = (r as unknown as { rows: { tid: string; role: string }[] }).rows[0];
    return { tid: row.tid, role: row.role, userId: request.ctx.userId };
  });
  app.get("/v1/auth/login", async () => ({ ok: true }));
  await app.ready();
  return app;
}

describe("authContext", () => {
  it("rejects a request without a token", async () => {
    const app = await buildMini();
    const res = await app.inject({ method: "GET", url: "/v1/ping" });
    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("allows public routes without a token", async () => {
    const app = await buildMini();
    const res = await app.inject({ method: "GET", url: "/v1/auth/login" });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it("sets ctx and RLS config from a valid token", async () => {
    const app = await buildMini();
    const token = signAccess(
      {
        sub: "00000000-0000-7000-8000-000000000001",
        tenantId: "00000000-0000-7000-8000-0000000000aa",
        role: "gestor",
      },
      SECRET,
    );
    const res = await app.inject({
      method: "GET",
      url: "/v1/ping",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.tid).toBe("00000000-0000-7000-8000-0000000000aa");
    expect(body.role).toBe("gestor");
    expect(body.userId).toBe("00000000-0000-7000-8000-000000000001");
    await app.close();
  });
});
