import { describe, it, expect } from "vitest";
import { createUserInput, updateUserInput } from "./user";

const validUser = {
  name: "Jane Doe",
  email: "user@example.com",
  password: "secret123",
  role: "vistoriador" as const,
};

describe("createUserInput", () => {
  it("parses valid input with an ASSIGNABLE_ROLES role", () => {
    const parsed = createUserInput.parse(validUser);
    expect(parsed.name).toBe("Jane Doe");
    expect(parsed.email).toBe("user@example.com");
    expect(parsed.role).toBe("vistoriador");
  });

  it("accepts the other assignable role: supervisor", () => {
    const parsed = createUserInput.parse({ ...validUser, role: "supervisor" });
    expect(parsed.role).toBe("supervisor");
  });

  it("rejects role 'superadmin' (not in ASSIGNABLE_ROLES)", () => {
    expect(() => createUserInput.parse({ ...validUser, role: "superadmin" })).toThrow();
  });

  it("rejects role 'gestor' (not in ASSIGNABLE_ROLES)", () => {
    expect(() => createUserInput.parse({ ...validUser, role: "gestor" })).toThrow();
  });

  it("rejects password shorter than 6 characters", () => {
    expect(() => createUserInput.parse({ ...validUser, password: "abc" })).toThrow();
  });

  it("rejects invalid email", () => {
    expect(() => createUserInput.parse({ ...validUser, email: "not-an-email" })).toThrow();
  });

  it("rejects missing name", () => {
    const { name: _name, ...rest } = validUser;
    expect(() => createUserInput.parse(rest)).toThrow();
  });
});

describe("updateUserInput", () => {
  it("allows partial fields (only name)", () => {
    const parsed = updateUserInput.parse({ name: "Updated Name" });
    expect(parsed.name).toBe("Updated Name");
  });

  it("allows partial fields (only email)", () => {
    const parsed = updateUserInput.parse({ email: "new@example.com" });
    expect(parsed.email).toBe("new@example.com");
  });

  it("allows empty object (all fields optional)", () => {
    const parsed = updateUserInput.parse({});
    expect(parsed).toEqual({});
  });

  it("rejects invalid email in update", () => {
    expect(() => updateUserInput.parse({ email: "bad-email" })).toThrow();
  });

  it("does not accept password field", () => {
    // password is omitted from updateUserInput, so the field is stripped
    const parsed = updateUserInput.parse({ name: "Test", password: "newpass1" } as any);
    expect((parsed as any).password).toBeUndefined();
  });
});
