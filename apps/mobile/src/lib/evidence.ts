import type { ApiClient } from "@vistoria/api-client";
import type { CreateEvidenceInput, EvidenceDto, ProofKind } from "@vistoria/contracts";
import { buildIdempotencyKey } from "./idempotency";

export interface SubmitEvidenceArgs {
  itemId: string;
  kind: ProofKind;
  attempt: number;
  requirementId?: string;
  filePath?: string;
  value?: Record<string, unknown>;
}

/**
 * Build a stable idempotency key and POST the evidence. The backend runs the IA
 * pipeline and returns the EvidenceDto with `accepted` + `validation`.
 */
export async function submitEvidence(
  client: ApiClient,
  args: SubmitEvidenceArgs,
): Promise<EvidenceDto> {
  const body: CreateEvidenceInput = {
    kind: args.kind,
    idempotencyKey: buildIdempotencyKey(args.itemId, args.kind, args.attempt),
    ...(args.requirementId !== undefined ? { requirementId: args.requirementId } : {}),
    ...(args.filePath !== undefined ? { filePath: args.filePath } : {}),
    ...(args.value !== undefined ? { value: args.value } : {}),
  };
  return client.evidences.create(args.itemId, body);
}
