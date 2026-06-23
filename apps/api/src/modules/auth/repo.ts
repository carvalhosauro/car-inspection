import { eq } from "drizzle-orm";
import { db, schema } from "@vistoria/db";

type UserRow = typeof schema.users.$inferSelect;

export async function findUserByEmail(email: string): Promise<UserRow | undefined> {
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return rows[0];
}

export async function findUserById(id: string): Promise<UserRow | undefined> {
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return rows[0];
}
