import type { UserRole } from "@vistoria/contracts";
import type { TenantContext, db } from "@vistoria/db";

export interface RequestCtx extends TenantContext {
  userId: string;
  tenantId: string | null;
  role: UserRole;
}

// The Drizzle transaction object handed to a `db.transaction(async (tx) => ...)` callback.
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

// Fastify request augmentation: ctx + the open tenant-scoped transaction.
declare module "fastify" {
  interface FastifyRequest {
    ctx: RequestCtx;
    tx: Tx;
  }
}
