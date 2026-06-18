import { describe, it, expect } from "vitest";
import { colors, typography, spacing } from "./index";

describe("color tokens", () => {
  it("exposes the exact brand palette", () => {
    expect(colors.primary).toBe("#2563EB");
    expect(colors.dark).toBe("#0F172A");
    expect(colors.success).toBe("#22C55E");
    expect(colors.warning).toBe("#F59E0B");
    expect(colors.error).toBe("#EF4444");
    expect(colors.neutralWhite).toBe("#FFFFFF");
    expect(colors.neutral50).toBe("#F8FAFC");
    expect(colors.neutral300).toBe("#CBD5E1");
    expect(colors.neutral600).toBe("#334155");
  });
});

describe("typography tokens", () => {
  it("maps sizes and weights from the spec", () => {
    expect(typography.h1).toEqual({ fontSize: 40, fontWeight: "700" });
    expect(typography.h2).toEqual({ fontSize: 32, fontWeight: "600" });
    expect(typography.h3).toEqual({ fontSize: 24, fontWeight: "600" });
    expect(typography.body).toEqual({ fontSize: 16, fontWeight: "400" });
    expect(typography.small).toEqual({ fontSize: 12, fontWeight: "400" });
  });
});

describe("spacing tokens", () => {
  it("exposes a 4px scale", () => {
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(16);
    expect(spacing.lg).toBe(24);
    expect(spacing.xl).toBe(32);
  });
});
