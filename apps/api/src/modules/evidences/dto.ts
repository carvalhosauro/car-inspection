import type { EvidenceDto, ProofKind } from "@vistoria/contracts";

export function evToDto(row: {
  id: string;
  inspectionItemId: string;
  requirementId: string | null;
  kind: string;
  filePath: string | null;
  value: unknown;
  validation: unknown;
  accepted: boolean | null;
  createdAt: Date;
}): EvidenceDto {
  return {
    id: row.id,
    inspectionItemId: row.inspectionItemId,
    requirementId: row.requirementId,
    kind: row.kind as ProofKind,
    filePath: row.filePath,
    value: (row.value as Record<string, unknown> | null) ?? null,
    validation: (row.validation as Record<string, unknown> | null) ?? null,
    accepted: row.accepted,
    createdAt: row.createdAt.toISOString(),
  };
}
