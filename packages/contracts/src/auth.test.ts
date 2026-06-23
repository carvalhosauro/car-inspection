import { describe, it, expect } from "vitest";
import {
  passwordSchema,
  loginInput,
  tokenPair,
  jwtPayload,
  meOutput,
} from "./auth";

const VALID_UUID = "00000000-0000-4000-a000-000000000001";
const VALID_EMAIL = "user@example.com";
const VALID_ROLE = "vistoriador";

describe("auth contracts", () => {
  // passwordSchema
  it("accepts a password of 6+ characters", () => {
    expect(passwordSchema.parse("secret")).toBe("secret");
  });

  it("rejects a password shorter than 6 characters", () => {
    expect(passwordSchema.safeParse("abc").success).toBe(false);
  });

  // loginInput
  it("parses valid login credentials", () => {
    const result = loginInput.parse({ email: VALID_EMAIL, password: "secret123" });
    expect(result.email).toBe(VALID_EMAIL);
    expect(result.password).toBe("secret123");
  });

  it("rejects an invalid email in loginInput", () => {
    expect(loginInput.safeParse({ email: "not-an-email", password: "secret123" }).success).toBe(false);
  });

  it("rejects a short password in loginInput", () => {
    expect(loginInput.safeParse({ email: VALID_EMAIL, password: "abc" }).success).toBe(false);
  });

  // tokenPair
  it("parses a valid token pair", () => {
    const result = tokenPair.parse({ accessToken: "acc.token.here", refreshToken: "ref.token.here" });
    expect(result.accessToken).toBe("acc.token.here");
    expect(result.refreshToken).toBe("ref.token.here");
  });

  // jwtPayload
  it("parses a valid JWT payload with a known role", () => {
    const result = jwtPayload.parse({ sub: VALID_UUID, tenantId: VALID_UUID, role: VALID_ROLE });
    expect(result.sub).toBe(VALID_UUID);
    expect(result.role).toBe(VALID_ROLE);
  });

  it("rejects an unknown role in jwtPayload", () => {
    expect(jwtPayload.safeParse({ sub: VALID_UUID, tenantId: null, role: "admin" }).success).toBe(false);
  });

  it("allows null tenantId in jwtPayload", () => {
    const result = jwtPayload.parse({ sub: VALID_UUID, tenantId: null, role: VALID_ROLE });
    expect(result.tenantId).toBeNull();
  });

  // meOutput
  it("parses valid meOutput", () => {
    const result = meOutput.parse({
      id: VALID_UUID,
      tenantId: VALID_UUID,
      name: "João Silva",
      email: VALID_EMAIL,
      role: VALID_ROLE,
    });
    expect(result.id).toBe(VALID_UUID);
    expect(result.name).toBe("João Silva");
    expect(result.role).toBe(VALID_ROLE);
  });
});
