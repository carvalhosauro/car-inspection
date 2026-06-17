import { buildApp } from "../app";
import { hashPassword } from "../core/auth/password";
import { signAccess } from "../core/auth/tokens";
import { db, schema } from "@vistoria/db";
import { newId } from "@vistoria/db";
import { env } from "../env";
import type { UserRole } from "@vistoria/contracts";

export async function buildTestApp() {
  const app = await buildApp();
  await app.ready();
  return app;
}

export interface SeededUser {
  id: string;
  tenantId: string | null;
  role: UserRole;
}

/** Inserts a tenant + one user per requested role, returns their ids. */
export async function seedTenant(roles: UserRole[]) {
  const tenantId = newId();
  await db.insert(schema.tenants).values({
    id: tenantId,
    name: `T-${tenantId.slice(0, 8)}`,
    slug: `t-${tenantId.replace(/-/g, "")}`,
    active: true,
  });
  const hash = await hashPassword("senha123");
  const users: Record<string, SeededUser> = {};
  for (const role of roles) {
    const id = newId();
    const isSuper = role === "superadmin";
    await db.insert(schema.users).values({
      id,
      tenantId: isSuper ? null : tenantId,
      name: `${role}-${id.slice(0, 6)}`,
      email: `${role}-${id.replace(/-/g, "")}@test.dev`,
      passwordHash: hash,
      role,
    });
    users[role] = { id, tenantId: isSuper ? null : tenantId, role };
  }
  return { tenantId, users };
}

export function authHeader(user: SeededUser) {
  const token = signAccess(
    { sub: user.id, tenantId: user.tenantId, role: user.role },
    env.JWT_SECRET,
  );
  return { authorization: `Bearer ${token}` };
}
