import { describe, it, expect } from "vitest";
import { resolveProgress } from "./ProgressBar.logic";

describe("resolveProgress", () => {
  it("uses warning for 0-49", () => {
    expect(resolveProgress(0).color).toBe("#F59E0B");
    expect(resolveProgress(49).color).toBe("#F59E0B");
  });
  it("uses primary for 50-99", () => {
    expect(resolveProgress(50).color).toBe("#2563EB");
    expect(resolveProgress(99).color).toBe("#2563EB");
  });
  it("uses success at 100", () => {
    expect(resolveProgress(100).color).toBe("#22C55E");
  });
  it("clamps below 0 and above 100", () => {
    expect(resolveProgress(-10).pct).toBe(0);
    expect(resolveProgress(150).pct).toBe(100);
  });
  it("returns the value as pct within range", () => {
    expect(resolveProgress(73).pct).toBe(73);
  });
});
