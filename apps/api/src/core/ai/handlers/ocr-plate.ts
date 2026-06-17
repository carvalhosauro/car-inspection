import type { ProofHandler } from "../registry.js";
import { annotateText } from "../vision.js";
import { extractPlate } from "../plate.js";

export const ocrPlateHandler: ProofHandler = async ({ bytes }) => {
  if (!bytes) return { accepted: null, validation: { reason: "pendente: sem bytes" } };
  let text: string | null;
  try {
    text = await annotateText(bytes);
  } catch {
    return { accepted: null, validation: { reason: "pendente: vision indisponivel" } };
  }
  if (!text) return { accepted: null, validation: { reason: "pendente: sem texto detectado" } };
  const plate = extractPlate(text);
  if (!plate) {
    return { accepted: false, validation: { reason: "placa não detectada", rawText: text } };
  }
  return { accepted: true, validation: { plate, rawText: text } };
};
