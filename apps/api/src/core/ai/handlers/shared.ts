import type { HandlerResult } from "../registry.js";

export function guardBytes(bytes: Buffer | undefined | null): HandlerResult | null {
  if (!bytes) return { accepted: null, validation: { reason: "pendente: sem bytes" } };
  return null;
}

export async function callAnnotateText(
  bytes: Buffer,
  annotateText: (image: Buffer) => Promise<string | null>,
): Promise<{ text: string } | { pending: HandlerResult }> {
  let text: string | null;
  try {
    text = await annotateText(bytes);
  } catch {
    return { pending: { accepted: null, validation: { reason: "pendente: vision indisponivel" } } };
  }
  if (!text) {
    return { pending: { accepted: null, validation: { reason: "pendente: sem texto detectado" } } };
  }
  return { text };
}
