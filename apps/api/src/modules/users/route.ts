import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createUserInput,
  updateUserInput,
  userDto,
  paginationQuerySchema,
  pageSchema,
} from "@vistoria/contracts";
import { requireRole } from "../../core/auth/require-role.js";
import { requireTenant } from "../../core/auth/require-tenant.js";
import * as service from "./service.js";

export async function userRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();
  const idParams = z.object({ id: z.string().uuid() });

  r.post(
    "/",
    {
      preHandler: requireRole(["gestor"]),
      schema: { body: createUserInput, response: { 201: userDto } },
    },
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
      preHandler: requireRole(["gestor"]),
      schema: { querystring: paginationQuerySchema, response: { 200: pageSchema(userDto) } },
    },
    async (request) => service.list(request.tx, requireTenant(request), request.query),
  );

  r.patch(
    "/:id",
    {
      preHandler: requireRole(["gestor"]),
      schema: { params: idParams, body: updateUserInput, response: { 200: userDto } },
    },
    async (request) => service.update(request.tx, requireTenant(request), request.params.id, request.body),
  );

  r.delete(
    "/:id",
    { preHandler: requireRole(["gestor"]), schema: { params: idParams } },
    async (request, reply) => {
      await service.softDelete(request.tx, requireTenant(request), request.params.id);
      reply.code(204);
      return null;
    },
  );
}
