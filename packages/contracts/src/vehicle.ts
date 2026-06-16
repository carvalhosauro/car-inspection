import { z } from "zod";
import { VEHICLE_STATUSES } from "./enums";

export const vehicleDto = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  plate: z.string(),
  model: z.string(),
  year: z.number().int().nullable(),
  color: z.string().nullable(),
  currentKm: z.number().int(),
  status: z.enum(VEHICLE_STATUSES),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type VehicleDto = z.infer<typeof vehicleDto>;

export const createVehicleInput = z.object({
  plate: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().optional(),
  color: z.string().optional(),
  currentKm: z.number().int().nonnegative().default(0),
  status: z.enum(VEHICLE_STATUSES).default("disponivel"),
});
export type CreateVehicleInput = z.infer<typeof createVehicleInput>;

export const updateVehicleInput = createVehicleInput.partial();
export type UpdateVehicleInput = z.infer<typeof updateVehicleInput>;
