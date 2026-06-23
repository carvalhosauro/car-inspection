import { describe, it, expect } from "vitest";
import { isUniqueViolation, PG_UNIQUE_VIOLATION } from "./errors.js";

describe("isUniqueViolation", () => {
  it("returns true when err has code '23505'", () => {
    expect(isUniqueViolation({ code: PG_UNIQUE_VIOLATION })).toBe(true);
  });

  it("returns false when err has a different error code", () => {
    expect(isUniqueViolation({ code: "23000" })).toBe(false);
  });

  it("returns false when err is a plain Error (no .code property)", () => {
    expect(isUniqueViolation(new Error("something went wrong"))).toBe(false);
  });

  it("returns false when err is null", () => {
    expect(isUniqueViolation(null)).toBe(false);
  });

  it("returns false when err is undefined", () => {
    expect(isUniqueViolation(undefined)).toBe(false);
  });

  it("returns false when err is a string", () => {
    expect(isUniqueViolation("23505")).toBe(false);
  });

  it("returns true when err has code '23505' alongside other properties", () => {
    expect(
      isUniqueViolation({ code: PG_UNIQUE_VIOLATION, detail: "Key already exists.", table: "users" })
    ).toBe(true);
  });
});
