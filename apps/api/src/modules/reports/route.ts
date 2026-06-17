import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireRole } from "../../core/auth/require-role";
import * as service from "./service";

export async function reportRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();
  const guard = requireRole(["superadmin", "gestor", "supervisor"]);

  r.get(
    "/summary",
    {
      preHandler: guard,
      schema: {
        response: {
          200: z.object({ byStatus: z.record(z.number()), total: z.number() }),
        },
      },
    },
    async (request) => service.summary(request.tx, request.ctx.tenantId),
  );

  r.get(
    "/damages-by-vehicle",
    {
      preHandler: guard,
      schema: {
        response: {
          200: z.object({
            items: z.array(z.object({ vehicleId: z.string(), damageCount: z.number() })),
          }),
        },
      },
    },
    async (request) => service.damages(request.tx, request.ctx.tenantId),
  );

  r.get(
    "/pending-by-inspector",
    {
      preHandler: guard,
      schema: {
        response: {
          200: z.object({
            items: z.array(z.object({ inspectorId: z.string(), pendingCount: z.number() })),
          }),
        },
      },
    },
    async (request) => service.pending(request.tx, request.ctx.tenantId),
  );

  r.get(
    "/avg-inspection-time",
    {
      preHandler: guard,
      schema: { response: { 200: z.object({ avgSeconds: z.number().nullable() }) } },
    },
    async (request) => service.avgTime(request.tx, request.ctx.tenantId),
  );
}
