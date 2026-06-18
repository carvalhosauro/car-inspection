import { describe, it, expect } from "vitest";
import { formatDisplayDate, toISODate } from "./DatePicker.logic";

describe("formatDisplayDate", () => {
  it("formats an ISO date to DD/MM/YYYY", () => {
    expect(formatDisplayDate("2026-01-15")).toBe("15/01/2026");
  });
  it("returns the input unchanged when malformed", () => {
    expect(formatDisplayDate("garbage")).toBe("garbage");
  });
});

describe("toISODate", () => {
  it("formats a Date to a zero-padded ISO date using local parts", () => {
    expect(toISODate(new Date(2026, 5, 18))).toBe("2026-06-18");
  });
});
