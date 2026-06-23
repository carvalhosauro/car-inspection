import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleDto,
  PaginationQuery,
} from "@vistoria/contracts";
import type { Tx } from "../../core/auth/types.js";
import { errors } from "../../core/errors/app-error.js";
import { isUniqueViolation } from "../../core/db/errors.js";
import { buildPage } from "../../core/utils/pagination.js";
import { VEHICLE_STATUS } from "../../core/constants/status.js";
import {
  insertVehicle,
  getVehicle,
  listVehicles,
  updateVehicle,
} from "./repo.js";

type Row = {
  id: string;
  tenantId: string;
  plate: string;
  model: string;
  year: number | null;
  color: string | null;
  currentKm: number;
  status: VehicleDto["status"];
  createdAt: Date;
  updatedAt: Date;
};

function toDto(row: Row): VehicleDto {
  return {
    id: row.id,
    tenantId: row.tenantId,
    plate: row.plate,
    model: row.model,
    year: row.year,
    color: row.color,
    currentKm: row.currentKm,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function create(
  tx: Tx,
  tenantId: string,
  input: CreateVehicleInput,
): Promise<VehicleDto> {
  try {
    const row = await insertVehicle(tx, tenantId, input);
    return toDto(row as Row);
  } catch (err: unknown) {
    if (isUniqueViolation(err)) {
      throw errors.conflict("Vehicle with this plate already exists in this tenant");
    }
    throw err;
  }
}

export async function get(tx: Tx, id: string, tenantId: string): Promise<VehicleDto> {
  const row = await getVehicle(tx, id, tenantId);
  if (!row) throw errors.notFound("Vehicle not found");
  return toDto(row as Row);
}

export async function list(
  tx: Tx,
  tenantId: string,
  query: PaginationQuery,
): Promise<{ items: VehicleDto[]; nextCursor: string | null }> {
  const rows = await listVehicles(tx, tenantId, query.cursor, query.limit);
  return buildPage(rows, query.limit, (r) => toDto(r as Row));
}

export async function update(
  tx: Tx,
  id: string,
  tenantId: string,
  input: UpdateVehicleInput,
): Promise<VehicleDto> {
  const row = await updateVehicle(tx, id, tenantId, input);
  if (!row) throw errors.notFound("Vehicle not found");
  return toDto(row as Row);
}

export async function softDelete(tx: Tx, id: string, tenantId: string): Promise<void> {
  // Sets vehicle to maintenance status rather than hard-deleting
  const row = await updateVehicle(tx, id, tenantId, { status: VEHICLE_STATUS.manutencao });
  if (!row) throw errors.notFound("Vehicle not found");
}
