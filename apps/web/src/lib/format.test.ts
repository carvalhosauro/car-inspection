import { describe, it, expect } from "vitest";
import { formatDate, formatPlate, formatInspectionStatus } from "./format";

describe("format helpers", () => {
  it("formats an ISO datetime as pt-BR date+time", () => {
    expect(formatDate("2026-06-10T13:45:00.000Z")).toMatch(/2026/);
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
