import { describe, it, expect } from "vitest";
import { createPgPoolConfig, getPgSslConfig, isLocalDatabaseUrl, stripSslQueryParams } from "./connection";

describe("connection helpers", () => {
  it("detects local database URLs", () => {
    expect(isLocalDatabaseUrl("postgresql://postgres:postgres@localhost:54322/postgres")).toBe(true);
    expect(isLocalDatabaseUrl("postgresql://u:p@aws-0-us-east-1.pooler.supabase.com:5432/postgres")).toBe(false);
  });

  it("enables ssl for remote hosts only", () => {
    expect(getPgSslConfig("postgresql://postgres:postgres@localhost:54322/postgres")).toBe(false);
    expect(getPgSslConfig("postgresql://u:p@aws-0-us-east-1.pooler.supabase.com:5432/postgres")).toEqual({
      rejectUnauthorized: false,
    });
  });

  it("strips sslmode query params", () => {
    const url =
      "postgresql://postgres.ref:secret@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require&foo=bar";
    expect(stripSslQueryParams(url)).toBe(
      "postgresql://postgres.ref:secret@aws-0-us-east-1.pooler.supabase.com:5432/postgres?foo=bar",
    );
  });

  it("builds pool config without sslmode in the connection string", () => {
    const config = createPgPoolConfig(
      "postgresql://postgres.ref:secret@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require",
      10,
    );
    expect(config.connectionString).not.toContain("sslmode");
    expect(config.ssl).toEqual({ rejectUnauthorized: false });
    expect(config.max).toBe(10);
  });
});
