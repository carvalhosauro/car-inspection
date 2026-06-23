import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireRole } from "../../core/auth/require-role.js";
import { requireTenant } from "../../core/auth/require-tenant.js";
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
      const tenantId = requireTenant(request);
      const out = await service.sign(tenantId, request.body.contentType);
      reply.code(201);
      return out;
    },
  );
}
