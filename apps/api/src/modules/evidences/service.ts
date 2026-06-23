import { isProofKind } from "@vistoria/contracts";
import type {
  CreateEvidenceInput,
  EvidenceDto,
  InspectionItemDto,
} from "@vistoria/contracts";
import type { Tx } from "../../core/auth/types.js";
import { errors } from "../../core/errors/app-error.js";
import { downloadBytes } from "../../core/storage/index.js";
import { aiRegistry, type HandlerCtx } from "../../core/ai/registry.js";
import { ITEM_STATUS } from "../../core/constants/status.js";
import { evToDto } from "./dto.js";
import {
  getInspectionItem,
  getInspection,
  getVehicle,
  findEvidenceByIdempotencyKey,
  priorPhotoHashesForVehicle,
  insertEvidence,
  updateInspectionItem,
  insertChildItem,
  listItemEvidences,
} from "./repo.js";

export async function createEvidence(
  tx: Tx,
  tenantId: string,
  inspectionItemId: string,
  input: CreateEvidenceInput,
): Promise<EvidenceDto> {
  if (!isProofKind(input.kind)) throw errors.badRequest(`Unknown proof kind: ${input.kind}`);

  const existing = await findEvidenceByIdempotencyKey(tx, inspectionItemId, input.idempotencyKey);
  if (existing) return evToDto(existing);

  const item = await getInspectionItem(tx, inspectionItemId);
  if (!item) throw errors.notFound("Inspection item not found");
  const inspection = await getInspection(tx, item.inspectionId);
  if (!inspection) throw errors.notFound("Inspection not found");
  const vehicle = await getVehicle(tx, inspection.vehicleId);
  if (!vehicle) throw errors.notFound("Vehicle not found");

  let bytes: Buffer | undefined;
  if (input.filePath) {
    try {
      bytes = await downloadBytes(input.filePath);
    } catch {
      bytes = undefined; // handler will return pending if bytes are required
    }
  }

  const ctx: HandlerCtx = {
    tenantId,
    vehicleId: vehicle.id,
    vehicleCurrentKm: vehicle.currentKm,
    priorPhotoHashes:
      input.kind === "photo" ? await priorPhotoHashesForVehicle(tx, vehicle.id) : [],
  };

  const result = await aiRegistry[input.kind]({
    bytes,
    value: input.value,
    config: {}, // per-requirement config is in the item snapshot; defaults suffice for MVP
    ctx,
  });

  const row = await insertEvidence(tx, {
    tenantId,
    inspectionItemId,
    requirementId: input.requirementId ?? null,
    kind: input.kind,
    filePath: input.filePath ?? null,
    value: input.value ?? null,
    validation: result.validation,
    accepted: result.accepted,
    idempotencyKey: input.idempotencyKey,
  });

  if (result.accepted === true) {
    await updateInspectionItem(tx, inspectionItemId, { status: ITEM_STATUS.conforme });
  }

  return evToDto(row);
}

export async function patchItem(
  tx: Tx,
  id: string,
  data: { status?: InspectionItemDto["status"]; justification?: string },
): Promise<InspectionItemDto> {
  const row = await updateInspectionItem(tx, id, data);
  if (!row) throw errors.notFound("Inspection item not found");
  const evidences = await listItemEvidences(tx, row.id);
  return {
    id: row.id,
    inspectionId: row.inspectionId,
    checklistItemId: row.checklistItemId,
    parentItemId: row.parentItemId,
    order: row.order,
    labelSnapshot: row.labelSnapshot,
    requirementsSnapshot: row.requirementsSnapshot as InspectionItemDto["requirementsSnapshot"],
    status: row.status,
    justification: row.justification,
    evidences: evidences.map(evToDto),
  };
}

export async function addChild(
  tx: Tx,
  tenantId: string,
  parentItemId: string,
  data: { labelSnapshot: string; order: number },
): Promise<InspectionItemDto> {
  const parent = await getInspectionItem(tx, parentItemId);
  if (!parent) throw errors.notFound("Parent item not found");
  const row = await insertChildItem(tx, {
    tenantId,
    inspectionId: parent.inspectionId,
    parentItemId,
    order: data.order,
    labelSnapshot: data.labelSnapshot,
  });
  return {
    id: row.id,
    inspectionId: row.inspectionId,
    checklistItemId: row.checklistItemId,
    parentItemId: row.parentItemId,
    order: row.order,
    labelSnapshot: row.labelSnapshot,
    requirementsSnapshot: [],
    status: row.status,
    justification: row.justification,
    evidences: [],
  };
}
