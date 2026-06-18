import type { ProofHandler } from "../registry.js";

// The unique code is server-generated at finish; this handler just records it.
export const uniqueCodeHandler: ProofHandler = async ({ value }) => {
  const code = (value as { code?: unknown } | undefined)?.code;
  if (typeof code === "string" && code.length > 0) {
    return { accepted: true, validation: { code } };
  }
  return { accepted: false, validation: { reason: "codigo ausente" } };
};
