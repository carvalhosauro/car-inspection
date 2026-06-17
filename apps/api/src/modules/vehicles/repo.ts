import { asc, eq, gt } from "drizzle-orm";
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
  return rows[0]!;
}

export async function getVehicle(tx: Tx, id: string) {
  const rows = await tx
    .select()
    .from(schema.vehicles)
    .where(eq(schema.vehicles.id, id))
    .limit(1);
  return rows[0];
}

export async function listVehicles(tx: Tx, cursor: string | undefined, limit: number) {
  const where = cursor ? gt(schema.vehicles.id, cursor) : undefined;
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
  data: Partial<UpdateVehicleInput> & { updatedAt?: Date; status?: string },
) {
  const rows = await tx
    .update(schema.vehicles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.vehicles.id, id))
    .returning();
  return rows[0];
}
