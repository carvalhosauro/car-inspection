import { eq } from "drizzle-orm";
import { schema } from "@vistoria/db";
import type { CreateTenantInput, TenantDto, PaginationQuery } from "@vistoria/contracts";
import type { Tx } from "../../core/auth/types.js";
import { hashPassword } from "../../core/auth/password.js";
import { errors } from "../../core/errors/app-error.js";
import { insertTenantWithGestor, listTenants } from "./repo.js";

function toDto(row: {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt: Date;
}): TenantDto {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    active: row.active,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function createTenant(tx: Tx, input: CreateTenantInput): Promise<TenantDto> {
  const hash = await hashPassword(input.gestor.password);
  try {
    const row = await insertTenantWithGestor(tx, input, hash);
    return toDto(row);
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      throw errors.conflict("Tenant slug or gestor email already exists");
    }
    throw err;
  }
}

export async function list(
  tx: Tx,
  query: PaginationQuery,
): Promise<{ items: TenantDto[]; nextCursor: string | null }> {
  const rows = await listTenants(tx, query.cursor, query.limit);
  const hasMore = rows.length > query.limit;
  const page = hasMore ? rows.slice(0, query.limit) : rows;
  return {
    items: page.map(toDto),
    nextCursor: hasMore ? page[page.length - 1]!.id : null,
  };
}

export async function setActive(tx: Tx, id: string, active: boolean): Promise<TenantDto> {
  const rows = await tx
    .update(schema.tenants)
    .set({ active })
    .where(eq(schema.tenants.id, id))
    .returning();
  if (!rows[0]) throw errors.notFound("Tenant not found");
  return toDto(rows[0]);
}
