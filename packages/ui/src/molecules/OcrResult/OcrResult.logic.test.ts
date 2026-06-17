import { describe, it, expect } from "vitest";
import { OCR_LABEL } from "./OcrResult.logic";

describe("OCR_LABEL", () => {
  it("labels placa and hodometro in pt-BR", () => {
    expect(OCR_LABEL.placa).toBe("Placa");
    expect(OCR_LABEL.hodometro).toBe("Hodômetro");
  });
});
