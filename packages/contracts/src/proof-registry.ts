import { z } from "zod";

export const PROOF_KINDS = [
  "photo", "ocr_plate", "ocr_km", "geo", "unique_code", "signature",
] as const;
export type ProofKind = (typeof PROOF_KINDS)[number];

export function isProofKind(value: string): value is ProofKind {
  return (PROOF_KINDS as readonly string[]).includes(value);
}

const configSchemas = {
  photo: z.object({
    expectedLabels: z.array(z.string()).default([]),
    minWidth: z.number().int().positive().optional(),
    minBlurScore: z.number().optional(),
    minHamming: z.number().int().optional(),
  }),
  ocr_plate: z.object({}).passthrough(),
  ocr_km: z.object({}).passthrough(),
  geo: z.object({}).passthrough(),
  unique_code: z.object({}).passthrough(),
  signature: z.object({}).passthrough(),
} satisfies Record<ProofKind, z.ZodTypeAny>;

const valueSchemas = {
  photo: z.object({}).passthrough(),
  ocr_plate: z.object({ plate: z.string() }),
  ocr_km: z.object({ km: z.number().int().nonnegative() }),
  geo: z.object({ lat: z.number(), lng: z.number() }),
  unique_code: z.object({ code: z.string() }),
  signature: z.object({}).passthrough(),
} satisfies Record<ProofKind, z.ZodTypeAny>;

export function proofConfigSchema<K extends ProofKind>(kind: K): (typeof configSchemas)[K] {
  return configSchemas[kind];
}
export function proofValueSchema<K extends ProofKind>(kind: K): (typeof valueSchemas)[K] {
  return valueSchemas[kind];
}
