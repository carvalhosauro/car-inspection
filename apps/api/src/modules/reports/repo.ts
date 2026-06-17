import { sql } from "drizzle-orm";
import { schema } from "@vistoria/db";
import type { Tx } from "../../core/auth/types.js";

export async function countByStatus(tx: Tx, tenantId: string) {
  const r = await tx.execute(sql`
    SELECT status, COUNT(*)::int AS count
    FROM ${schema.inspections}
    WHERE tenant_id = ${tenantId}
    GROUP BY status
  `);
  return (r as unknown as { rows: { status: string; count: number }[] }).rows;
}

export async function damagesByVehicle(tx: Tx, tenantId: string) {
  const r = await tx.execute(sql`
    SELECT i.vehicle_id AS "vehicleId", COUNT(it.id)::int AS "damageCount"
    FROM ${schema.inspectionItems} it
    JOIN ${schema.inspections} i ON i.id = it.inspection_id
    WHERE it.status = 'nao_conforme' AND i.tenant_id = ${tenantId}
    GROUP BY i.vehicle_id
    ORDER BY "damageCount" DESC
  `);
  return (r as unknown as { rows: { vehicleId: string; damageCount: number }[] }).rows;
}

export async function pendingByInspector(tx: Tx, tenantId: string) {
  const r = await tx.execute(sql`
    SELECT inspector_id AS "inspectorId", COUNT(*)::int AS "pendingCount"
    FROM ${schema.inspections}
    WHERE status IN ('atribuida', 'em_andamento') AND tenant_id = ${tenantId}
    GROUP BY inspector_id
    ORDER BY "pendingCount" DESC
  `);
  return (r as unknown as { rows: { inspectorId: string; pendingCount: number }[] }).rows;
}

export async function avgInspectionSeconds(tx: Tx, tenantId: string): Promise<number | null> {
  const r = await tx.execute(sql`
    SELECT AVG(EXTRACT(EPOCH FROM (finished_at - started_at)))::float AS "avgSeconds"
    FROM ${schema.inspections}
    WHERE finished_at IS NOT NULL AND started_at IS NOT NULL AND tenant_id = ${tenantId}
  `);
  const rows = (r as unknown as { rows: { avgSeconds: number | null }[] }).rows;
  return rows[0]?.avgSeconds ?? null;
}
