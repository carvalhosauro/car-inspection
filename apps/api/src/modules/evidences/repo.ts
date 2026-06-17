import { and, asc, eq } from "drizzle-orm";
import { schema, newId } from "@vistoria/db";
import type { Tx } from "../../core/auth/types.js";

export async function getInspectionItem(tx: Tx, id: string) {
  const rows = await tx
    .select()
    .from(schema.inspectionItems)
    .where(eq(schema.inspectionItems.id, id))
    .limit(1);
  return rows[0];
}

export async function getInspection(tx: Tx, id: string) {
  const rows = await tx
    .select()
    .from(schema.inspections)
    .where(eq(schema.inspections.id, id))
    .limit(1);
  return rows[0];
}

export async function getVehicle(tx: Tx, id: string) {
  const rows = await tx.select().from(schema.vehicles).where(eq(schema.vehicles.id, id)).limit(1);
  return rows[0];
}

export async function findEvidenceByIdempotencyKey(
  tx: Tx,
  inspectionItemId: string,
  idempotencyKey: string,
) {
  const rows = await tx
    .select()
    .from(schema.inspectionEvidences)
    .where(
      and(
        eq(schema.inspectionEvidences.inspectionItemId, inspectionItemId),
        eq(schema.inspectionEvidences.idempotencyKey, idempotencyKey),
      ),
    )
    .limit(1);
  return rows[0];
}

export async function priorPhotoHashesForVehicle(tx: Tx, vehicleId: string): Promise<string[]> {
  // join evidence -> item -> inspection, filter same vehicle + kind=photo, accepted
  const rows = await tx
    .select({ validation: schema.inspectionEvidences.validation })
    .from(schema.inspectionEvidences)
    .innerJoin(
      schema.inspectionItems,
      eq(schema.inspectionEvidences.inspectionItemId, schema.inspectionItems.id),
    )
    .innerJoin(
      schema.inspections,
      eq(schema.inspectionItems.inspectionId, schema.inspections.id),
    )
    .where(
      and(
        eq(schema.inspections.vehicleId, vehicleId),
        eq(schema.inspectionEvidences.kind, "photo"),
      ),
    );
  return rows
    .map((r) => (r.validation as { dedupHash?: string } | null)?.dedupHash)
    .filter((h): h is string => typeof h === "string");
}

export async function insertEvidence(
  tx: Tx,
  data: {
    tenantId: string;
    inspectionItemId: string;
    requirementId: string | null;
    kind: string;
    filePath: string | null;
    value: unknown;
    validation: unknown;
    accepted: boolean | null;
    idempotencyKey: string;
  },
) {
  const rows = await tx
    .insert(schema.inspectionEvidences)
    .values({ id: newId(), ...data })
    .returning();
  return rows[0]!;
}

export async function updateInspectionItem(
  tx: Tx,
  id: string,
  data: Partial<{ status: string; justification: string }>,
) {
  const rows = await tx
    .update(schema.inspectionItems)
    .set(data as never)
    .where(eq(schema.inspectionItems.id, id))
    .returning();
  return rows[0];
}

export async function insertChildItem(
  tx: Tx,
  data: {
    tenantId: string;
    inspectionId: string;
    parentItemId: string;
    order: number;
    labelSnapshot: string;
  },
) {
  const rows = await tx
    .insert(schema.inspectionItems)
    .values({
      id: newId(),
      tenantId: data.tenantId,
      inspectionId: data.inspectionId,
      parentItemId: data.parentItemId,
      checklistItemId: null,
      order: data.order,
      labelSnapshot: data.labelSnapshot,
      requirementsSnapshot: [],
      status: "pendente",
    })
    .returning();
  return rows[0]!;
}

export async function listItemEvidences(tx: Tx, inspectionItemId: string) {
  return tx
    .select()
    .from(schema.inspectionEvidences)
    .where(eq(schema.inspectionEvidences.inspectionItemId, inspectionItemId))
    .orderBy(asc(schema.inspectionEvidences.id));
}
