export type OcrType = "placa" | "hodometro";

export const OCR_LABEL: Record<OcrType, string> = {
  placa: "Placa (OCR)",
  hodometro: "Hodômetro (OCR)",
};

export interface OcrResultProps {
  type: OcrType;
  result: string;
  imageUrl?: string;
  validated?: boolean;
}
