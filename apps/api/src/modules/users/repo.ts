import { asc, eq, gt } from "drizzle-orm";
import { schema, newId } from "@vistoria/db";
import type { Tx } from "../../core/auth/types";
import type { UserRole } from "@vistoria/contracts";

export async function insertUser(
  tx: Tx,
  tenantId: string,
  data: { name: string; email: string; passwordHash: string; role: UserRole },
) {
  const rows = await tx
    .insert(schema.users)
    .values({ id: newId(), tenantId, ...data })
    .returning();
  return rows[0]!;
}

export async function listUsers(tx: Tx, cursor: string | undefined, limit: number) {
  const where = cursor ? gt(schema.users.id, cursor) : undefined;
  return tx
    .select()
    .from(schema.users)
    .where(where)
    .orderBy(asc(schema.users.id))
    .limit(limit + 1);
}

export async function updateUser(
  tx: Tx,
  id: string,
  data: Partial<{ name: string; email: string; role: UserRole; active: boolean }>,
) {
  const rows = await tx
    .update(schema.users)
    .set(data)
    .where(eq(schema.users.id, id))
    .returning();
  return rows[0];
}
