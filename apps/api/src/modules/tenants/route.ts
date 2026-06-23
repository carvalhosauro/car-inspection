import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createTenantInput,
  tenantDto,
  paginationQuerySchema,
  pageSchema,
} from "@vistoria/contracts";
import { requireRole } from "../../core/auth/require-role.js";
import * as service from "./service.js";

export async function tenantRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.post(
    "/",
    {
      preHandler: requireRole(["superadmin"]),
      schema: { body: createTenantInput, response: { 201: tenantDto } },
    },
    async (request, reply) => {
      const dto = await service.createTenant(request.tx, request.body);
      reply.code(201);
      return dto;
    },
  );

  r.get(
    "/",
    {
      preHandler: requireRole(["superadmin"]),
      schema: { querystring: paginationQuerySchema, response: { 200: pageSchema(tenantDto) } },
    },
    async (request) => service.list(request.tx, request.query),
  );

  r.patch(
    "/:id",
    {
      preHandler: requireRole(["superadmin"]),
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ active: z.boolean() }),
        response: { 200: tenantDto },
      },
    },
    async (request) => service.setActive(request.tx, request.params.id, request.body.active),
  );
}
