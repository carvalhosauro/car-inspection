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
import { errors } from "../../core/errors/app-error.js";
import * as service from "./service.js";

export async function vehicleRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();
  const idParams = z.object({ id: z.string().uuid() });
  const guard = requireRole(["gestor", "supervisor"]);

  r.post(
    "/",
    { preHandler: guard, schema: { body: createVehicleInput, response: { 201: vehicleDto } } },
    async (request, reply) => {
      if (request.ctx.tenantId === null) throw errors.badRequest("Must belong to a tenant");
      const dto = await service.create(request.tx, request.ctx.tenantId, request.body);
      reply.status(201).send(dto);
    },
  );

  r.get(
    "/",
    {
      preHandler: guard,
      schema: { querystring: paginationQuerySchema, response: { 200: pageSchema(vehicleDto) } },
    },
    async (request) => {
      if (request.ctx.tenantId === null) throw errors.badRequest("Must belong to a tenant");
      return service.list(request.tx, request.ctx.tenantId, request.query);
    },
  );

  r.get(
    "/:id",
    { preHandler: guard, schema: { params: idParams, response: { 200: vehicleDto } } },
    async (request) => {
      if (request.ctx.tenantId === null) throw errors.badRequest("Must belong to a tenant");
      return service.get(request.tx, request.params.id, request.ctx.tenantId);
    },
  );

  r.patch(
    "/:id",
    {
      preHandler: guard,
      schema: { params: idParams, body: updateVehicleInput, response: { 200: vehicleDto } },
    },
    async (request) => {
      if (request.ctx.tenantId === null) throw errors.badRequest("Must belong to a tenant");
      return service.update(request.tx, request.params.id, request.ctx.tenantId, request.body);
    },
  );

  r.delete(
    "/:id",
    { preHandler: guard, schema: { params: idParams } },
    async (request, reply) => {
      if (request.ctx.tenantId === null) throw errors.badRequest("Must belong to a tenant");
      await service.softDelete(request.tx, request.params.id, request.ctx.tenantId);
      reply.status(204).send();
    },
  );
}
