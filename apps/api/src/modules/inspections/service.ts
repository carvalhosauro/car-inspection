import { ulid } from "ulid";
import { eq } from "drizzle-orm";
import { schema } from "@vistoria/db";
import type {
  CreateInspectionInput,
  InspectionDto,
  InspectionItemDto,
  EvidenceDto,
  AuditInput,
  PaginationQuery,
  ProofKind,
} from "@vistoria/contracts";
import type { Tx } from "../../core/auth/types";
import { errors } from "../../core/errors/app-error";
import {
  getVehicle,
  getTemplate,
  getTemplateItems,
  getItemRequirements,
  insertInspection,
  insertInspectionItem,
  getInspection,
  listInspectionItems,
  listItemEvidences,
  updateInspection,
  listInspections,
  listInspectorToday,
  type InspectionFilter,
} from "./repo";

type InspectionRow = {
  id: string;
  tenantId: string;
  vehicleId: string;
  inspectorId: string;
  templateId: string;
  type: InspectionDto["type"];
  status: InspectionDto["status"];
  result: InspectionDto["result"];
  scheduledFor: Date | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  geoLat: string | null;
  geoLng: string | null;
  uniqueCode: string | null;
  createdAt: Date;
};

function toDto(row: InspectionRow): InspectionDto {
  return {
    id: row.id,
    tenantId: row.tenantId,
    vehicleId: row.vehicleId,
    inspectorId: row.inspectorId,
    templateId: row.templateId,
    type: row.type,
    status: row.status,
    result: row.result,
    scheduledFor: row.scheduledFor ? row.scheduledFor.toISOString() : null,
    startedAt: row.startedAt ? row.startedAt.toISOString() : null,
    finishedAt: row.finishedAt ? row.finishedAt.toISOString() : null,
    geoLat: row.geoLat !== null ? Number(row.geoLat) : null,
    geoLng: row.geoLng !== null ? Number(row.geoLng) : null,
    uniqueCode: row.uniqueCode,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function create(
  tx: Tx,
  tenantId: string,
  input: CreateInspectionInput,
): Promise<InspectionDto> {
  const vehicle = await getVehicle(tx, input.vehicleId);
  if (!vehicle) throw errors.notFound("Vehicle not found");
  const template = await getTemplate(tx, input.templateId);
  if (!template) throw errors.notFound("Template not found");

  const inspection = await insertInspection(tx, {
    tenantId,
    vehicleId: input.vehicleId,
    inspectorId: input.inspectorId,
    templateId: input.templateId,
    type: input.type,
    scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : null,
  });

  const items = await getTemplateItems(tx, input.templateId);
  for (const item of items) {
    const reqs = await getItemRequirements(tx, item.id);
    const requirementsSnapshot = reqs.map((req) => ({
      kind: req.kind as ProofKind,
      required: req.required,
      config: (req.config as Record<string, unknown> | null) ?? null,
    }));
    await insertInspectionItem(tx, {
      tenantId,
      inspectionId: inspection.id,
      checklistItemId: item.id,
      order: item.order,
      labelSnapshot: item.label,
      requirementsSnapshot,
    });
  }
  return toDto(inspection as InspectionRow);
}

async function itemToDto(tx: Tx, row: {
  id: string;
  inspectionId: string;
  checklistItemId: string | null;
  parentItemId: string | null;
  order: number;
  labelSnapshot: string;
  requirementsSnapshot: unknown;
  status: InspectionItemDto["status"];
  justification: string | null;
}): Promise<InspectionItemDto> {
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

function evToDto(row: {
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

export async function getById(tx: Tx, id: string): Promise<InspectionDto> {
  const row = await getInspection(tx, id);
  if (!row) throw errors.notFound("Inspection not found");
  return toDto(row as InspectionRow);
}

export async function items(tx: Tx, inspectionId: string): Promise<InspectionItemDto[]> {
  const insp = await getInspection(tx, inspectionId);
  if (!insp) throw errors.notFound("Inspection not found");
  const rows = await listInspectionItems(tx, inspectionId);
  return Promise.all(rows.map((row) => itemToDto(tx, row)));
}

export async function start(tx: Tx, id: string): Promise<InspectionDto> {
  const insp = await getInspection(tx, id);
  if (!insp) throw errors.notFound("Inspection not found");
  if (insp.status !== "atribuida") throw errors.unprocessable("Inspection already started");
  const row = await updateInspection(tx, id, {
    status: "em_andamento",
    startedAt: new Date(),
  });
  return toDto(row as InspectionRow);
}

export async function finish(
  tx: Tx,
  id: string,
  geo: { geoLat: number; geoLng: number },
): Promise<InspectionDto> {
  const insp = await getInspection(tx, id);
  if (!insp) throw errors.notFound("Inspection not found");
  if (insp.status !== "em_andamento") throw errors.unprocessable("Inspection is not in progress");

  const tenant = await tx
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.id, insp.tenantId))
    .limit(1);
  const slug = tenant[0]?.slug ?? "tenant";
  const uniqueCode = `VST-${slug}-${ulid()}`;

  const allItems = await listInspectionItems(tx, id);
  const hasNonConforme = allItems.some((i) => i.status === "nao_conforme");

  const row = await updateInspection(tx, id, {
    status: "concluida",
    result: hasNonConforme ? "com_pendencias" : "conforme",
    finishedAt: new Date(),
    geoLat: geo.geoLat.toString(),
    geoLng: geo.geoLng.toString(),
    uniqueCode,
  });
  return toDto(row as InspectionRow);
}

export async function audit(
  tx: Tx,
  id: string,
  auditedBy: string,
  input: AuditInput,
): Promise<InspectionDto> {
  const insp = await getInspection(tx, id);
  if (!insp) throw errors.notFound("Inspection not found");
  if (insp.status !== "concluida") {
    throw errors.unprocessable("Only a concluded inspection can be audited");
  }
  const row = await updateInspection(tx, id, {
    status: input.decision,
    auditedBy,
    auditNote: input.auditNote ?? null,
    auditedAt: new Date(),
  });
  return toDto(row as InspectionRow);
}

export async function list(
  tx: Tx,
  filter: InspectionFilter,
  query: PaginationQuery,
): Promise<{ items: InspectionDto[]; nextCursor: string | null }> {
  const rows = await listInspections(tx, filter, query.cursor, query.limit);
  const hasMore = rows.length > query.limit;
  const page = hasMore ? rows.slice(0, query.limit) : rows;
  return {
    items: page.map((r) => toDto(r as InspectionRow)),
    nextCursor: hasMore ? page[page.length - 1]!.id : null,
  };
}

export async function myToday(
  tx: Tx,
  inspectorId: string,
): Promise<{ items: InspectionDto[] }> {
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);
  const rows = await listInspectorToday(tx, inspectorId, dayStart, dayEnd);
  return { items: rows.map((r) => toDto(r as InspectionRow)) };
}

export async function myHistory(
  tx: Tx,
  inspectorId: string,
  query: PaginationQuery,
): Promise<{ items: InspectionDto[]; nextCursor: string | null }> {
  return list(tx, { inspectorId }, query);
}
