export type OcrType = "placa" | "hodometro";

export const OCR_LABEL: Record<OcrType, string> = {
  placa: "Placa",
  hodometro: "Hodômetro",
};

export interface OcrResultProps {
  type: OcrType;
  value: string;
  imageUrl?: string;
  validated?: boolean;
}
