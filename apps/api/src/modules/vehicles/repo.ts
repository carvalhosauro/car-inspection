import { asc, eq, gt, and } from "drizzle-orm";
import { schema, newId } from "@vistoria/db";
import type { Tx } from "../../core/auth/types";
import type { CreateVehicleInput, UpdateVehicleInput } from "@vistoria/contracts";

export async function insertVehicle(tx: Tx, tenantId: string, input: CreateVehicleInput) {
  const rows = await tx
    .insert(schema.vehicles)
    .values({
      id: newId(),
      tenantId,
      plate: input.plate,
      model: input.model,
      year: input.year ?? null,
      color: input.color ?? null,
      currentKm: input.currentKm,
      status: input.status,
    })
    .returning();
  const row = rows[0];
  if (!row) throw new Error("Insert returned no row");
  return row;
}

export async function getVehicle(tx: Tx, id: string, tenantId: string) {
  const rows = await tx
    .select()
    .from(schema.vehicles)
    .where(and(eq(schema.vehicles.id, id), eq(schema.vehicles.tenantId, tenantId)))
    .limit(1);
  return rows[0];
}

export async function listVehicles(tx: Tx, tenantId: string, cursor: string | undefined, limit: number) {
  const where = cursor ? and(eq(schema.vehicles.tenantId, tenantId), gt(schema.vehicles.id, cursor)) : eq(schema.vehicles.tenantId, tenantId);
  return tx
    .select()
    .from(schema.vehicles)
    .where(where)
    .orderBy(asc(schema.vehicles.id))
    .limit(limit + 1);
}

export async function updateVehicle(
  tx: Tx,
  id: string,
  tenantId: string,
  data: Partial<UpdateVehicleInput> & { updatedAt?: Date; status?: string },
) {
  const rows = await tx
    .update(schema.vehicles)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(schema.vehicles.id, id), eq(schema.vehicles.tenantId, tenantId)))
    .returning();
  return rows[0];
}
