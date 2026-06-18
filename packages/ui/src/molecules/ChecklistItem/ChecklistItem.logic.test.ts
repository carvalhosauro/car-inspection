import { describe, it, expect } from "vitest";
import { CHECKLIST_CONFIG } from "./ChecklistItem.logic";

describe("CHECKLIST_CONFIG", () => {
  it("covers the three states", () => {
    expect(Object.keys(CHECKLIST_CONFIG).sort()).toEqual(
      ["conforme", "nao-conforme", "pendente"]
    );
  });
  it("conforme is success with a check", () => {
    expect(CHECKLIST_CONFIG.conforme).toEqual({ icon: "✓", color: "#22C55E" });
  });
  it("nao-conforme is error", () => {
    expect(CHECKLIST_CONFIG["nao-conforme"].color).toBe("#EF4444");
  });
  it("pendente is warning with an empty marker", () => {
    expect(CHECKLIST_CONFIG.pendente.color).toBe("#F59E0B");
  });
});
