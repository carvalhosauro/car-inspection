import { describe, it, expect } from "vitest";
import { formatDate, formatPlate, formatInspectionStatus } from "./format";

describe("format helpers", () => {
  it("formats an ISO datetime as pt-BR date+time", () => {
    const result = formatDate("2026-01-15T10:30:00.000Z");
    expect(result).toMatch(/15/);           // day present
    expect(result).toMatch(/2026/);         // year present
    expect(result).toMatch(/:/);            // time separator present
    expect(result).toMatch(/\d{2}:\d{2}/); // hh:mm pattern
  });

  it("returns a dash for null dates", () => {
    expect(formatDate(null)).toBe("—");
  });

  it("uppercases and trims a plate", () => {
    expect(formatPlate(" abc1d23 ")).toBe("ABC1D23");
  });

  it("maps inspection status to a human label", () => {
    expect(formatInspectionStatus("em_andamento")).toBe("Em andamento");
    expect(formatInspectionStatus("aprovada")).toBe("Aprovada");
  });
});
