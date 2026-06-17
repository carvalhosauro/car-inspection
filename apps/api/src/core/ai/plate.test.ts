import { describe, it, expect } from "vitest";
import { extractPlate } from "./plate.js";

describe("extractPlate", () => {
  it("matches a Mercosul plate AAA1A23", () => {
    expect(extractPlate("placa ABC1D23 do veiculo")).toBe("ABC1D23");
  });

  it("matches an old plate AAA1234", () => {
    expect(extractPlate("PLACA ABC1234")).toBe("ABC1234");
  });

  it("normalizes lowercase and a hyphen", () => {
    expect(extractPlate("abc-1234")).toBe("ABC1234");
  });

  it("returns null when no plate present", () => {
    expect(extractPlate("nenhuma placa aqui 12")).toBeNull();
  });

  it("returns null for substring match ABC1D234 (should be exact match only)", () => {
    expect(extractPlate("ABC1D234")).toBeNull();
  });

  it("returns null for substring match ABCD1234 (should be exact match only)", () => {
    expect(extractPlate("ABCD1234")).toBeNull();
  });
});
