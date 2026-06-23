import { describe, it, expect } from "vitest";
import { ICON_BUTTON_GLYPHS as ICON_GLYPH } from "../../native-glyphs";

describe("ICON_GLYPH", () => {
  it("covers all six icon names", () => {
    expect(Object.keys(ICON_GLYPH).sort()).toEqual(
      ["arrow-right", "camera", "edit", "plus", "search", "trash"]
    );
  });
  it("each glyph is a non-empty string", () => {
    for (const g of Object.values(ICON_GLYPH)) {
      expect(typeof g).toBe("string");
      expect(g.length).toBeGreaterThan(0);
    }
  });
});
