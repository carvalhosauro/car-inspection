import { describe, it, expect } from "vitest";
import { createTenantInput } from "./tenant";

const validTenant = {
  name: "Locadora ABC",
  slug: "locadora-abc",
  gestor: {
    name: "Carlos Gestor",
    email: "gestor@example.com",
    password: "senha123",
  },
};

describe("createTenantInput", () => {
  it("parses a valid tenant input", () => {
    const parsed = createTenantInput.parse(validTenant);
    expect(parsed.name).toBe("Locadora ABC");
    expect(parsed.slug).toBe("locadora-abc");
    expect(parsed.gestor.email).toBe("gestor@example.com");
  });

  it("accepts slugs with numbers and hyphens", () => {
    const parsed = createTenantInput.parse({ ...validTenant, slug: "empresa-01" });
    expect(parsed.slug).toBe("empresa-01");
  });

  it("rejects empty name", () => {
    expect(() => createTenantInput.parse({ ...validTenant, name: "" })).toThrow();
  });

  it("rejects empty slug", () => {
    expect(() => createTenantInput.parse({ ...validTenant, slug: "" })).toThrow();
  });

  it("rejects slug with uppercase letters", () => {
    expect(() => createTenantInput.parse({ ...validTenant, slug: "Locadora-ABC" })).toThrow();
  });

  it("rejects slug with spaces", () => {
    expect(() => createTenantInput.parse({ ...validTenant, slug: "locadora abc" })).toThrow();
  });

  it("rejects slug with special characters", () => {
    expect(() => createTenantInput.parse({ ...validTenant, slug: "locadora_abc!" })).toThrow();
  });

  it("rejects invalid gestor email", () => {
    expect(() =>
      createTenantInput.parse({
        ...validTenant,
        gestor: { ...validTenant.gestor, email: "not-an-email" },
      })
    ).toThrow();
  });

  it("rejects short password for gestor (less than 6 chars)", () => {
    expect(() =>
      createTenantInput.parse({
        ...validTenant,
        gestor: { ...validTenant.gestor, password: "abc" },
      })
    ).toThrow();
  });

  it("accepts password exactly 6 characters long", () => {
    const parsed = createTenantInput.parse({
      ...validTenant,
      gestor: { ...validTenant.gestor, password: "abcdef" },
    });
    expect(parsed.gestor.password).toBe("abcdef");
  });

  it("rejects missing gestor name", () => {
    const { name: _n, ...gestorWithoutName } = validTenant.gestor;
    expect(() =>
      createTenantInput.parse({ ...validTenant, gestor: gestorWithoutName })
    ).toThrow();
  });
});
