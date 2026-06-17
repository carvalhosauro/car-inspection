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
import { requireRole } from "../../core/auth/require-role";
import { errors } from "../../core/errors/app-error";
import * as service from "./service";

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
      if (request.ctx.tenantId === null) throw errors.badRequest("Gestor must belong to a tenant");
      const dto = await service.create(request.tx, request.ctx.tenantId, request.body);
      reply.status(201).send(dto);
    },
  );

  r.get(
    "/",
    {
      preHandler: requireRole(["gestor"]),
      schema: { querystring: paginationQuerySchema, response: { 200: pageSchema(userDto) } },
    },
    async (request) => service.list(request.tx, request.ctx.tenantId!, request.query),
  );

  r.patch(
    "/:id",
    {
      preHandler: requireRole(["gestor"]),
      schema: { params: idParams, body: updateUserInput, response: { 200: userDto } },
    },
    async (request) => service.update(request.tx, request.ctx.tenantId!, request.params.id, request.body),
  );

  r.delete(
    "/:id",
    { preHandler: requireRole(["gestor"]), schema: { params: idParams } },
    async (request, reply) => {
      await service.softDelete(request.tx, request.ctx.tenantId!, request.params.id);
      reply.status(204).send();
    },
  );
}
