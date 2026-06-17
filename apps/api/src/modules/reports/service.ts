import type { Tx } from "../../core/auth/types";
import {
  countByStatus,
  damagesByVehicle,
  pendingByInspector,
  avgInspectionSeconds,
} from "./repo";

export async function summary(tx: Tx) {
  const rows = await countByStatus(tx);
  const byStatus: Record<string, number> = {};
  let total = 0;
  for (const row of rows) {
    byStatus[row.status] = row.count;
    total += row.count;
  }
  return { byStatus, total };
}

export async function damages(tx: Tx) {
  return { items: await damagesByVehicle(tx) };
}

export async function pending(tx: Tx) {
  return { items: await pendingByInspector(tx) };
}

export async function avgTime(tx: Tx) {
  return { avgSeconds: await avgInspectionSeconds(tx) };
}
