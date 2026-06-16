import type { ProofHandler } from "../registry";
import { annotateText } from "../vision";

export const ocrKmHandler: ProofHandler = async ({ bytes, ctx }) => {
  if (!bytes) return { accepted: null, validation: { reason: "pendente: sem bytes" } };
  let text: string;
  try {
    text = await annotateText(bytes);
  } catch {
    return { accepted: null, validation: { reason: "pendente: vision indisponivel" } };
  }
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
