import type { ProofHandler } from "../registry";
import { annotateText } from "../vision";
import { extractPlate } from "../plate";

export const ocrPlateHandler: ProofHandler = async ({ bytes }) => {
  if (!bytes) return { accepted: null, validation: { reason: "pendente: sem bytes" } };
  let text: string;
  try {
    text = await annotateText(bytes);
  } catch {
    return { accepted: null, validation: { reason: "pendente: vision indisponivel" } };
  }
  const plate = extractPlate(text);
  if (!plate) {
    return { accepted: false, validation: { reason: "placa não detectada", rawText: text } };
  }
  return { accepted: true, validation: { plate, rawText: text } };
};
