import type { ProofHandler } from "../registry.js";
import { annotateText } from "../vision.js";

export const ocrKmHandler: ProofHandler = async ({ bytes, ctx }) => {
  if (!bytes) return { accepted: null, validation: { reason: "pendente: sem bytes" } };
  let text: string | null;
  try {
    text = await annotateText(bytes);
  } catch {
    return { accepted: null, validation: { reason: "pendente: vision indisponivel" } };
  }
  if (!text) return { accepted: null, validation: { reason: "pendente: sem texto detectado" } };
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
