import { describe, it, expect } from "vitest";
import { resolveInputState } from "./Input.logic";

describe("resolveInputState", () => {
  it("is error when errorMessage present", () => {
    expect(resolveInputState({ errorMessage: "Obrigatório" })).toBe("error");
  });
  it("is filled when value is non-empty and no error", () => {
    expect(resolveInputState({ value: "ABC1234" })).toBe("filled");
  });
  it("is default when empty and no error", () => {
    expect(resolveInputState({ value: "" })).toBe("default");
    expect(resolveInputState({})).toBe("default");
  });
  it("error wins over filled", () => {
    expect(resolveInputState({ value: "x", errorMessage: "bad" })).toBe("error");
  });
});
