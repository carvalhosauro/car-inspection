import { z } from "zod";
import { PROOF_KINDS } from "./proof-registry";
import {
  INSPECTION_TYPES, INSPECTION_STATUSES, INSPECTION_RESULTS, ITEM_STATUSES,
} from "./enums";

export const evidenceDto = z.object({
  id: z.string().uuid(),
  inspectionItemId: z.string().uuid(),
  requirementId: z.string().uuid().nullable(),
  kind: z.enum(PROOF_KINDS),
  filePath: z.string().nullable(),
  value: z.record(z.unknown()).nullable(),
  validation: z.record(z.unknown()).nullable(),
  accepted: z.boolean().nullable(),
  createdAt: z.string().datetime(),
});
export type EvidenceDto = z.infer<typeof evidenceDto>;

export const inspectionItemDto = z.object({
  id: z.string().uuid(),
  inspectionId: z.string().uuid(),
  checklistItemId: z.string().uuid().nullable(),
  parentItemId: z.string().uuid().nullable(),
  order: z.number().int(),
  labelSnapshot: z.string(),
  requirementsSnapshot: z.array(z.object({
    kind: z.enum(PROOF_KINDS),
    required: z.boolean(),
    config: z.record(z.unknown()).nullable(),
  })),
  status: z.enum(ITEM_STATUSES),
  justification: z.string().nullable(),
  evidences: z.array(evidenceDto),
});
export type InspectionItemDto = z.infer<typeof inspectionItemDto>;

export const inspectionDto = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  inspectorId: z.string().uuid(),
  templateId: z.string().uuid(),
  type: z.enum(INSPECTION_TYPES),
  status: z.enum(INSPECTION_STATUSES),
  result: z.enum(INSPECTION_RESULTS).nullable(),
  scheduledFor: z.string().datetime().nullable(),
  startedAt: z.string().datetime().nullable(),
  finishedAt: z.string().datetime().nullable(),
  geoLat: z.number().nullable(),
  geoLng: z.number().nullable(),
  uniqueCode: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type InspectionDto = z.infer<typeof inspectionDto>;

export const createInspectionInput = z.object({
  vehicleId: z.string().uuid(),
  templateId: z.string().uuid(),
  inspectorId: z.string().uuid(),
  type: z.enum(INSPECTION_TYPES),
  scheduledFor: z.string().datetime().optional(),
});
export type CreateInspectionInput = z.infer<typeof createInspectionInput>;

export const createEvidenceInput = z.object({
  kind: z.enum(PROOF_KINDS),
  requirementId: z.string().uuid().optional(),
  filePath: z.string().optional(),
  value: z.record(z.unknown()).optional(),
  idempotencyKey: z.string().min(1),
});
export type CreateEvidenceInput = z.infer<typeof createEvidenceInput>;

const AUDIT_DECISIONS = ["aprovada", "reprovada"] as const;

export const auditInput = z.object({
  decision: z.enum(AUDIT_DECISIONS),
  auditNote: z.string().optional(),
});
export type AuditInput = z.infer<typeof auditInput>;
