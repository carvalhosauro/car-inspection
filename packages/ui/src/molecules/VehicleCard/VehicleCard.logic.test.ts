import { describe, it, expect } from "vitest";
import { formatKm } from "./VehicleCard.logic";

describe("formatKm", () => {
  it("groups thousands with a dot and appends km", () => {
    expect(formatKm(45000)).toBe("45.000 km");
  });
  it("handles small values", () => {
    expect(formatKm(0)).toBe("0 km");
    expect(formatKm(999)).toBe("999 km");
  });
  it("handles millions", () => {
    expect(formatKm(1234567)).toBe("1.234.567 km");
  });
});
