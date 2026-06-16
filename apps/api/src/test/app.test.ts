import { describe, it, expect, afterAll } from "vitest";
import { buildTestApp } from "./helpers";

const appPromise = buildTestApp();

describe("app bootstrap", () => {
  it("serves the health route", async () => {
    const app = await appPromise;
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });

  it("serves the OpenAPI json", async () => {
    const app = await appPromise;
    const res = await app.inject({ method: "GET", url: "/docs/json" });
    expect(res.statusCode).toBe(200);
    expect(res.json().openapi).toBeDefined();
  });

  it("returns the standardized 401 body shape on a protected route", async () => {
    const app = await appPromise;
    const res = await app.inject({ method: "GET", url: "/v1/auth/me" });
    expect(res.statusCode).toBe(401);
    expect(res.json().code).toBe("unauthorized");
  });

  afterAll(async () => {
    (await appPromise).close();
  });
});
