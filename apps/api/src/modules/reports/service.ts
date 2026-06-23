import type { Tx } from "../../core/auth/types.js";
import {
  countByStatus,
  damagesByVehicle,
  pendingByInspector,
  avgInspectionSeconds,
} from "./repo.js";

export async function summary(
  tx: Tx,
  tenantId: string,
): Promise<{ inspections: number; pending: number; approved: number; rejected: number }> {
  const rows = await countByStatus(tx, tenantId);
  const byStatus: Record<string, number> = {};
  let total = 0;
  for (const row of rows) {
    byStatus[row.status] = row.count;
    total += row.count;
  }
  return {
    inspections: total,
    pending: (byStatus["atribuida"] ?? 0) + (byStatus["em_andamento"] ?? 0) + (byStatus["concluida"] ?? 0),
    approved: byStatus["aprovada"] ?? 0,
    rejected: byStatus["reprovada"] ?? 0,
  };
}

export async function damages(
  tx: Tx,
  tenantId: string,
): Promise<{ items: { vehicleId: string; damageCount: number }[] }> {
  return { items: await damagesByVehicle(tx, tenantId) };
}

export async function pending(
  tx: Tx,
  tenantId: string,
): Promise<{ items: { inspectorId: string; pendingCount: number }[] }> {
  return { items: await pendingByInspector(tx, tenantId) };
}

export async function avgTime(
  tx: Tx,
  tenantId: string,
): Promise<{ avgSeconds: number | null }> {
  return { avgSeconds: await avgInspectionSeconds(tx, tenantId) };
}
