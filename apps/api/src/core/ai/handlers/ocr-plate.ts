import type { ProofHandler } from "../registry.js";
import { annotateText } from "../vision.js";
import { extractPlate } from "../plate.js";
import { guardBytes, callAnnotateText } from "./shared.js";

export const ocrPlateHandler: ProofHandler = async ({ bytes }) => {
  const bytesGuard = guardBytes(bytes)
  if (bytesGuard) return bytesGuard
  const result = await callAnnotateText(bytes!, annotateText)
  if ('pending' in result) return result.pending
  const { text } = result
  const plate = extractPlate(text);
  if (!plate) {
    return { accepted: false, validation: { reason: "placa não detectada", rawText: text } };
  }
  return { accepted: true, validation: { plate, rawText: text } };
};
