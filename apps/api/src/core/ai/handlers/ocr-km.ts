import type { ProofHandler } from "../registry.js";
import { annotateText } from "../vision.js";
import { guardBytes, callAnnotateText } from "./shared.js";

export const ocrKmHandler: ProofHandler = async ({ bytes, ctx }) => {
  const bytesGuard = guardBytes(bytes)
  if (bytesGuard) return bytesGuard
  const result = await callAnnotateText(bytes!, annotateText)
  if ('pending' in result) return result.pending
  const { text } = result
  const digits = text.replace(/[^0-9]/g, "");
  if (!digits) {
    return { accepted: false, validation: { reason: "km não detectado", rawText: text } };
  }
  const km = Number(digits);
  if (km < ctx.vehicleCurrentKm) {
    return {
      accepted: false,
      validation: {
        km,
        reason: `km lido (${km}) abaixo do km atual (${ctx.vehicleCurrentKm})`,
      },
    };
  }
  return { accepted: true, validation: { km, rawText: text } };
};
