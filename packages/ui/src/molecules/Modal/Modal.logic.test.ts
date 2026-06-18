import { describe, it, expect } from "vitest";
import { resolveModalLabels } from "./Modal.logic";

describe("resolveModalLabels", () => {
  it("defaults to Confirmar / Cancelar", () => {
    expect(resolveModalLabels({})).toEqual({ confirm: "Confirmar", cancel: "Cancelar" });
  });
  it("respects provided labels", () => {
    expect(resolveModalLabels({ confirmLabel: "Aprovar", cancelLabel: "Voltar" }))
      .toEqual({ confirm: "Aprovar", cancel: "Voltar" });
  });
});
