import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { schema, newId } from "@vistoria/db";
import type { Tx } from "../../core/auth/types.js";
import { INSPECTION_STATUS, ITEM_STATUS } from "../../core/constants/status.js";

type InspectionInsert = typeof schema.inspections.$inferInsert;
type InspectionType = InspectionInsert["type"];
type InspectionStatusValue = typeof schema.inspections.$inferSelect["status"];

export async function getVehicle(tx: Tx, id: string) {
  const rows = await tx.select().from(schema.vehicles).where(eq(schema.vehicles.id, id)).limit(1);
  return rows[0];
}

export async function getTemplate(tx: Tx, id: string) {
  const rows = await tx
    .select()
    .from(schema.checklistTemplates)
    .where(eq(schema.checklistTemplates.id, id))
    .limit(1);
  return rows[0];
}

export async function getTemplateItems(tx: Tx, templateId: string) {
  return tx
    .select()
    .from(schema.checklistItems)
    .where(eq(schema.checklistItems.templateId, templateId))
    .orderBy(asc(schema.checklistItems.order));
}

export async function getItemRequirements(tx: Tx, checklistItemId: string) {
  return tx
    .select()
    .from(schema.checklistItemRequirements)
    .where(eq(schema.checklistItemRequirements.checklistItemId, checklistItemId))
    .orderBy(asc(schema.checklistItemRequirements.order));
}

export async function insertInspection(
  tx: Tx,
  data: {
    tenantId: string;
    vehicleId: string;
    inspectorId: string;
    templateId: string;
    type: InspectionType;
    scheduledFor?: Date | null;
  },
) {
  const rows = await tx
    .insert(schema.inspections)
    .values({
      id: newId(),
      tenantId: data.tenantId,
      vehicleId: data.vehicleId,
      inspectorId: data.inspectorId,
      templateId: data.templateId,
      type: data.type,
      status: INSPECTION_STATUS.atribuida,
      scheduledFor: data.scheduledFor ?? null,
    })
    .returning();
  return rows[0]!;
}

export async function insertInspectionItem(
  tx: Tx,
  data: {
    tenantId: string;
    inspectionId: string;
    checklistItemId: string | null;
    order: number;
    labelSnapshot: string;
    requirementsSnapshot: unknown;
  },
) {
  const rows = await tx
    .insert(schema.inspectionItems)
    .values({
      id: newId(),
      tenantId: data.tenantId,
      inspectionId: data.inspectionId,
      checklistItemId: data.checklistItemId,
      order: data.order,
      labelSnapshot: data.labelSnapshot,
      requirementsSnapshot: data.requirementsSnapshot,
      status: ITEM_STATUS.pendente,
    })
    .returning();
  return rows[0]!;
}

export async function getInspection(tx: Tx, tenantId: string, id: string) {
  const rows = await tx
    .select()
    .from(schema.inspections)
    .where(and(eq(schema.inspections.tenantId, tenantId), eq(schema.inspections.id, id)))
    .limit(1);
  return rows[0];
}

export async function listInspectionItems(tx: Tx, tenantId: string, inspectionId: string) {
  return tx
    .select()
    .from(schema.inspectionItems)
    .where(and(eq(schema.inspectionItems.tenantId, tenantId), eq(schema.inspectionItems.inspectionId, inspectionId)))
    .orderBy(asc(schema.inspectionItems.order), asc(schema.inspectionItems.id));
}

export async function listItemEvidences(tx: Tx, inspectionItemId: string) {
  return tx
    .select()
    .from(schema.inspectionEvidences)
    .where(eq(schema.inspectionEvidences.inspectionItemId, inspectionItemId))
    .orderBy(asc(schema.inspectionEvidences.id));
}

export async function updateInspection(
  tx: Tx,
  tenantId: string,
  id: string,
  data: Partial<InspectionInsert>,
) {
  const rows = await tx
    .update(schema.inspections)
    .set(data)
    .where(and(eq(schema.inspections.tenantId, tenantId), eq(schema.inspections.id, id)))
    .returning();
  return rows[0];
}

export interface InspectionFilter {
  // status accepts a plain string because the route querystring is validated as
  // z.string(); cast at the use-site below to the inspection-status enum.
  status?: string;
  inspectorId?: string;
  vehicleId?: string;
  from?: Date;
  to?: Date;
}

export async function listInspections(
  tx: Tx,
  tenantId: string,
  filter: InspectionFilter,
  cursor: string | undefined,
  limit: number,
) {
  const conds = [eq(schema.inspections.tenantId, tenantId)];
  if (filter.status) conds.push(eq(schema.inspections.status, filter.status as InspectionStatusValue));
  if (filter.inspectorId) conds.push(eq(schema.inspections.inspectorId, filter.inspectorId));
  if (filter.vehicleId) conds.push(eq(schema.inspections.vehicleId, filter.vehicleId));
  if (filter.from) conds.push(gt(schema.inspections.createdAt, filter.from));
  if (filter.to) conds.push(lt(schema.inspections.createdAt, filter.to));
  if (cursor) conds.push(gt(schema.inspections.id, cursor));
  return tx
    .select()
    .from(schema.inspections)
    .where(and(...conds))
    .orderBy(asc(schema.inspections.id))
    .limit(limit + 1);
}

export async function listInspectorToday(tx: Tx, inspectorId: string, dayStart: Date, dayEnd: Date) {
  return tx
    .select()
    .from(schema.inspections)
    .where(
      and(
        eq(schema.inspections.inspectorId, inspectorId),
        gt(schema.inspections.createdAt, dayStart),
        lt(schema.inspections.createdAt, dayEnd),
      ),
    )
    .orderBy(desc(schema.inspections.createdAt));
}
