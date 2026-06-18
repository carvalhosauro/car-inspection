import { describe, it, expect } from "vitest";
import { resolveButtonState } from "./Button.logic";

describe("resolveButtonState", () => {
  it("defaults to primary/md and interactive", () => {
    const s = resolveButtonState({ label: "Save" });
    expect(s).toEqual({ isInteractive: true, variant: "primary", size: "md" });
  });
  it("is non-interactive when disabled", () => {
    expect(resolveButtonState({ label: "x", disabled: true }).isInteractive).toBe(false);
  });
  it("is non-interactive when loading", () => {
    expect(resolveButtonState({ label: "x", loading: true }).isInteractive).toBe(false);
  });
  it("passes through variant and size", () => {
    const s = resolveButtonState({ label: "x", variant: "danger", size: "sm" });
    expect(s.variant).toBe("danger");
    expect(s.size).toBe("sm");
  });
});
