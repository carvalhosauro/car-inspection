import { describe, it, expect, beforeAll } from "vitest";
import { sql } from "drizzle-orm";
import { db, txWithTenant } from "./index";

describe("txWithTenant", () => {
  beforeAll(async () => {
    // requires DATABASE_URL pointing at a migrated DB
    await db.execute(sql`SELECT 1`);
  });

  it("sets app.tenant_id inside the transaction", async () => {
    const tenantId = "00000000-0000-7000-8000-000000000001";
    const got = await txWithTenant({ tenantId, role: "gestor" }, async (tx) => {
      const r = await tx.execute(sql`SELECT current_setting('app.tenant_id', true) AS tid`);
      return (r as unknown as { rows: { tid: string }[] }).rows[0].tid;
    });
    expect(got).toBe(tenantId);
  });

  it("sets app.role for superadmin", async () => {
    const got = await txWithTenant({ tenantId: null, role: "superadmin" }, async (tx) => {
      const r = await tx.execute(sql`SELECT current_setting('app.role', true) AS role`);
      return (r as unknown as { rows: { role: string }[] }).rows[0].role;
    });
    expect(got).toBe("superadmin");
  });
});
