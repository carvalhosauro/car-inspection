import { describe, it, expect } from "vitest";
import { extractPlate } from "./plate";

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
});
