import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createVehicleInput,
  updateVehicleInput,
  vehicleDto,
  paginationQuerySchema,
  pageSchema,
} from "@vistoria/contracts";
import { requireRole } from "../../core/auth/require-role.js";
import { requireTenant } from "../../core/auth/require-tenant.js";
import * as service from "./service.js";

export async function vehicleRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();
  const idParams = z.object({ id: z.string().uuid() });
  const guard = requireRole(["gestor", "supervisor"]);

  r.post(
    "/",
    { preHandler: guard, schema: { body: createVehicleInput, response: { 201: vehicleDto } } },
    async (request, reply) => {
      const tenantId = requireTenant(request);
      const dto = await service.create(request.tx, tenantId, request.body);
      reply.code(201);
      return dto;
    },
  );

  r.get(
    "/",
    {
      preHandler: guard,
      schema: { querystring: paginationQuerySchema, response: { 200: pageSchema(vehicleDto) } },
    },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.list(request.tx, tenantId, request.query);
    },
  );

  r.get(
    "/:id",
    { preHandler: guard, schema: { params: idParams, response: { 200: vehicleDto } } },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.get(request.tx, request.params.id, tenantId);
    },
  );

  r.patch(
    "/:id",
    {
      preHandler: guard,
      schema: { params: idParams, body: updateVehicleInput, response: { 200: vehicleDto } },
    },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.update(request.tx, request.params.id, tenantId, request.body);
    },
  );

  r.delete(
    "/:id",
    { preHandler: guard, schema: { params: idParams } },
    async (request, reply) => {
      const tenantId = requireTenant(request);
      await service.softDelete(request.tx, request.params.id, tenantId);
      reply.code(204);
      return null;
    },
  );
}
