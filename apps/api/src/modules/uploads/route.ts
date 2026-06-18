import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireRole } from "../../core/auth/require-role.js";
import { errors } from "../../core/errors/app-error.js";
import * as service from "./service.js";

export async function uploadRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.post(
    "/sign",
    {
      preHandler: requireRole(["gestor", "supervisor", "vistoriador"]),
      schema: {
        body: z.object({ contentType: z.string().default("image/jpeg") }),
        response: {
          201: z.object({
            filePath: z.string(),
            signedUrl: z.string(),
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      if (request.ctx.tenantId === null) throw errors.badRequest("Must belong to a tenant");
      const out = await service.sign(request.ctx.tenantId, request.body.contentType);
      reply.status(201).send(out);
    },
  );
}
