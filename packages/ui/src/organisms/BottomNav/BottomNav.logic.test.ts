import { describe, it, expect } from "vitest";
import { DEFAULT_TABS, formatBadge } from "./BottomNav.logic";

describe("BottomNav logic", () => {
  it("ships five tabs with a center camera tab", () => {
    expect(DEFAULT_TABS).toHaveLength(5);
    expect(DEFAULT_TABS.map((t) => t.label)).toEqual([
      "Início",
      "Vistorias",
      "Câmera",
      "Alertas",
      "Perfil",
    ]);
    expect(DEFAULT_TABS.find((t) => t.id === "camera")?.center).toBe(true);
  });
  it("formatBadge hides zero and caps at 9+", () => {
    expect(formatBadge(0)).toBeNull();
    expect(formatBadge(3)).toBe("3");
    expect(formatBadge(12)).toBe("9+");
  });
});
