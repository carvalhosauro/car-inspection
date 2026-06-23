import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { requireRole } from "../../core/auth/require-role.js";
import { requireTenant } from "../../core/auth/require-tenant.js";
import * as service from "./service.js";

export async function reportRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();
  const guard = requireRole(["superadmin", "gestor", "supervisor"]);

  r.get(
    "/summary",
    {
      preHandler: guard,
      schema: {
        response: {
          200: z.object({
            inspections: z.number(),
            pending: z.number(),
            approved: z.number(),
            rejected: z.number(),
          }),
        },
      },
    },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.summary(request.tx, tenantId);
    },
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
    async (request) => {
      const tenantId = requireTenant(request);
      return service.damages(request.tx, tenantId);
    },
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
    async (request) => {
      const tenantId = requireTenant(request);
      return service.pending(request.tx, tenantId);
    },
  );

  r.get(
    "/avg-inspection-time",
    {
      preHandler: guard,
      schema: { response: { 200: z.object({ avgSeconds: z.number().nullable() }) } },
    },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.avgTime(request.tx, tenantId);
    },
  );
}
