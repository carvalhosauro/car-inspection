import { describe, it, expect } from "vitest";
import { formatLocation } from "./GeoTag.logic";

describe("formatLocation", () => {
  it("joins city and state with a comma", () => {
    expect(formatLocation("São Paulo", "SP")).toBe("São Paulo, SP");
  });
  it("trims surrounding whitespace", () => {
    expect(formatLocation("  Rio de Janeiro ", " RJ ")).toBe("Rio de Janeiro, RJ");
  });
});
