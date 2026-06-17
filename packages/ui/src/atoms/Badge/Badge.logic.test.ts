import { describe, it, expect } from "vitest";
import { BADGE_CONFIG } from "./Badge.logic";

describe("BADGE_CONFIG", () => {
  it("covers all five status variants", () => {
    expect(Object.keys(BADGE_CONFIG).sort()).toEqual(
      ["agendado", "concluido", "em-andamento", "pendente", "reprovado"]
    );
  });
  it("maps concluido to success color and label", () => {
    expect(BADGE_CONFIG.concluido.label).toBe("Concluído");
    expect(BADGE_CONFIG.concluido.color).toBe("#22C55E");
  });
  it("maps reprovado to error color", () => {
    expect(BADGE_CONFIG.reprovado.color).toBe("#EF4444");
    expect(BADGE_CONFIG.reprovado.label).toBe("Reprovado");
  });
  it("maps pendente to warning color", () => {
    expect(BADGE_CONFIG.pendente.color).toBe("#F59E0B");
  });
});
