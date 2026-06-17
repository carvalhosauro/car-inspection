import type { Tx } from "../../core/auth/types.js";
import {
  countByStatus,
  damagesByVehicle,
  pendingByInspector,
  avgInspectionSeconds,
} from "./repo.js";

export async function summary(tx: Tx, tenantId: string) {
  const rows = await countByStatus(tx, tenantId);
  const byStatus: Record<string, number> = {};
  let total = 0;
  for (const row of rows) {
    byStatus[row.status] = row.count;
    total += row.count;
  }
  return { byStatus, total };
}

export async function damages(tx: Tx, tenantId: string) {
  return { items: await damagesByVehicle(tx, tenantId) };
}

export async function pending(tx: Tx, tenantId: string) {
  return { items: await pendingByInspector(tx, tenantId) };
}

export async function avgTime(tx: Tx, tenantId: string) {
  return { avgSeconds: await avgInspectionSeconds(tx, tenantId) };
}
