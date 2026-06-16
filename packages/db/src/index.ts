import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import type { UserRole } from "@vistoria/contracts";
import * as schema from "./schema";

const queryClient = new Pool({ connectionString: process.env.DATABASE_URL!, max: 10 });
export const db = drizzle(queryClient, { schema });
export { schema };
export type Database = typeof db;

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
  fn: (tx: Parameters<Parameters<Database["transaction"]>[0]>[0]) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.tenant_id', ${ctx.tenantId ?? ""}, true)`);
    await tx.execute(sql`SELECT set_config('app.role', ${ctx.role}, true)`);
    return fn(tx);
  });
}
