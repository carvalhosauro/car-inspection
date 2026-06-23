import type {
  CreateUserInput,
  UpdateUserInput,
  UserDto,
  PaginationQuery,
} from "@vistoria/contracts";
import type { Tx } from "../../core/auth/types.js";
import { hashPassword } from "../../core/auth/password.js";
import { errors } from "../../core/errors/app-error.js";
import { isUniqueViolation } from "../../core/db/errors.js";
import { buildPage } from "../../core/utils/pagination.js";
import { insertUser, listUsers, updateUser } from "./repo.js";

type Row = {
  id: string;
  tenantId: string | null;
  name: string;
  email: string;
  role: UserDto["role"];
  active: boolean;
  createdAt: Date;
};

function toDto(row: Row): UserDto {
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    email: row.email,
    role: row.role,
    active: row.active,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function create(
  tx: Tx,
  tenantId: string,
  input: CreateUserInput,
): Promise<UserDto> {
  const passwordHash = await hashPassword(input.password);
  try {
    const row = await insertUser(tx, tenantId, {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });
    return toDto(row as Row);
  } catch (err: unknown) {
    if (isUniqueViolation(err)) throw errors.conflict("Email already in use");
    throw err;
  }
}

export async function list(
  tx: Tx,
  tenantId: string,
  query: PaginationQuery,
): Promise<{ items: UserDto[]; nextCursor: string | null }> {
  const rows = await listUsers(tx, tenantId, query.cursor, query.limit);
  return buildPage(rows, query.limit, (r) => toDto(r as Row));
}

export async function update(
  tx: Tx,
  tenantId: string,
  id: string,
  input: UpdateUserInput,
): Promise<UserDto> {
  const row = await updateUser(tx, tenantId, id, input);
  if (!row) throw errors.notFound("User not found");
  return toDto(row as Row);
}

export async function softDelete(tx: Tx, tenantId: string, id: string): Promise<void> {
  const row = await updateUser(tx, tenantId, id, { active: false });
  if (!row) throw errors.notFound("User not found");
}
