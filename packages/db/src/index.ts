import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import type { UserRole } from "@vistoria/contracts";
import * as schema from "./schema";
import { createPgPoolConfig } from "./connection.js";
export { newId } from "./id";

const DB_POOL_MAX = parseInt(process.env.DB_POOL_MAX ?? "10", 10);
const queryClient = new Pool(createPgPoolConfig(process.env.DATABASE_URL!, DB_POOL_MAX));
export const db = drizzle(queryClient, { schema });
export { schema };
export type Database = typeof db;
export type DrizzleTx = Parameters<Parameters<Database["transaction"]>[0]>[0]

export interface TenantContext {
  tenantId: string | null;
  role: UserRole;
}

/**
 * Runs `fn` inside a transaction that has the RLS context variables set,
 * so Postgres RLS policies see the caller's tenant + role.
 */
export async function txWithTenant<T>(
  ctx: TenantContext,
  fn: (tx: DrizzleTx) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.tenant_id', ${ctx.tenantId ?? ""}, true)`);
    await tx.execute(sql`SELECT set_config('app.role', ${ctx.role}, true)`);
    return fn(tx);
  });
}
