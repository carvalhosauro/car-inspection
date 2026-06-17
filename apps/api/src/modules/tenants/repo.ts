import { asc, gt, eq } from "drizzle-orm";
import { schema, newId } from "@vistoria/db";
import type { Tx } from "../../core/auth/types";
import type { CreateTenantInput } from "@vistoria/contracts";

export async function insertTenantWithGestor(
  tx: Tx,
  input: CreateTenantInput,
  gestorPasswordHash: string,
) {
  const tenantId = newId();
  await tx.insert(schema.tenants).values({
    id: tenantId,
    name: input.name,
    slug: input.slug,
    active: true,
  });
  await tx.insert(schema.users).values({
    id: newId(),
    tenantId,
    name: input.gestor.name,
    email: input.gestor.email,
    passwordHash: gestorPasswordHash,
    role: "gestor",
  });
  const rows = await tx
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.id, tenantId));
  return rows[0]!;
}

export async function listTenants(tx: Tx, cursor: string | undefined, limit: number) {
  const where = cursor ? gt(schema.tenants.id, cursor) : undefined;
  return tx
    .select()
    .from(schema.tenants)
    .where(where)
    .orderBy(asc(schema.tenants.id))
    .limit(limit + 1);
}
