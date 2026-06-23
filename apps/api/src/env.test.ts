import { describe, it, expect } from "vitest";
import { loadEnv } from "./env.js";

describe("loadEnv", () => {
  it("parses a complete environment with local storage", () => {
    const env = loadEnv({
      DATABASE_URL: "postgresql://u:p@localhost:5432/db",
      STORAGE_DRIVER: "local",
      JWT_SECRET: "a",
      JWT_REFRESH_SECRET: "b",
      PORT: "3333",
    });
    expect(env.PORT).toBe(3333);
    expect(env.STORAGE_DRIVER).toBe("local");
  });

  it("parses supabase storage driver", () => {
    const env = loadEnv({
      DATABASE_URL: "postgresql://u:p@localhost:5432/db",
      STORAGE_DRIVER: "supabase",
      SUPABASE_URL: "http://localhost:54321",
      SUPABASE_SERVICE_KEY: "key",
      SUPABASE_STORAGE_BUCKET: "vistoria-photos",
      JWT_SECRET: "a",
      JWT_REFRESH_SECRET: "b",
    });
    expect(env.SUPABASE_STORAGE_BUCKET).toBe("vistoria-photos");
  });

  it("throws when DATABASE_URL is missing", () => {
    expect(() =>
      loadEnv({
        STORAGE_DRIVER: "local",
        JWT_SECRET: "a",
        JWT_REFRESH_SECRET: "b",
      }),
    ).toThrow();
  });

  it("throws when supabase driver lacks credentials", () => {
    expect(() =>
      loadEnv({
        DATABASE_URL: "postgresql://u:p@localhost:5432/db",
        STORAGE_DRIVER: "supabase",
        JWT_SECRET: "a",
        JWT_REFRESH_SECRET: "b",
      }),
    ).toThrow();
  });

  it("defaults PORT to 3333 when absent", () => {
    const env = loadEnv({
      DATABASE_URL: "postgresql://u:p@localhost:5432/db",
      JWT_SECRET: "a",
      JWT_REFRESH_SECRET: "b",
    });
    expect(env.PORT).toBe(3333);
  });
});
