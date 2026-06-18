import { describe, it, expect } from "vitest";
import { formatLocation, GEO_STATUS_CONFIG } from "./GeoTag.logic";

describe("formatLocation", () => {
  it("formats lat/lng to 6 decimal places", () => {
    expect(formatLocation(-23.5505, -46.6333)).toBe("-23.550500, -46.633300");
  });
  it("formats positive coordinates", () => {
    expect(formatLocation(40.7128, -74.006)).toBe("40.712800, -74.006000");
  });
});

describe("GEO_STATUS_CONFIG", () => {
  it("has entries for all statuses", () => {
    expect(GEO_STATUS_CONFIG.pending.label).toBe("Aguardando GPS...");
    expect(GEO_STATUS_CONFIG.acquired.label).toBe("Localização obtida");
    expect(GEO_STATUS_CONFIG.error.label).toBe("Erro de GPS");
  });
});
