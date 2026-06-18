import { describe, it, expect } from "vitest";
import { resolveChange } from "./StatCard.logic";

describe("resolveChange", () => {
  it("returns null when no change", () => {
    expect(resolveChange({ value: "120", label: "Vistorias" })).toBeNull();
  });
  it("up uses success and an up arrow", () => {
    const r = resolveChange({ value: "1", label: "x", change: "12%", changeDirection: "up" });
    expect(r).toEqual({ arrow: "↑", color: "#166534" });
  });
  it("down uses error and a down arrow", () => {
    const r = resolveChange({ value: "1", label: "x", change: "3%", changeDirection: "down" });
    expect(r).toEqual({ arrow: "↓", color: "#EF4444" });
  });
});
