import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createEvidenceInput,
  evidenceDto,
  inspectionItemDto,
  ITEM_STATUSES,
} from "@vistoria/contracts";
import { requireRole } from "../../core/auth/require-role.js";
import { requireTenant } from "../../core/auth/require-tenant.js";
import * as service from "./service.js";

const idParams = z.object({ id: z.string().uuid() });

export async function evidenceRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();
  const execute = requireRole(["gestor", "supervisor", "vistoriador"]);

  r.patch(
    "/inspection-items/:id",
    {
      preHandler: execute,
      schema: {
        params: idParams,
        body: z.object({
          status: z.enum(ITEM_STATUSES).optional(),
          justification: z.string().optional(),
        }),
        response: { 200: inspectionItemDto },
      },
    },
    async (request) => service.patchItem(request.tx, request.params.id, request.body),
  );

  r.post(
    "/inspection-items/:id/children",
    {
      preHandler: execute,
      schema: {
        params: idParams,
        body: z.object({ labelSnapshot: z.string().min(1), order: z.number().int().default(0) }),
        response: { 201: inspectionItemDto },
      },
    },
    async (request, reply) => {
      const tenantId = requireTenant(request);
      const dto = await service.addChild(
        request.tx,
        tenantId,
        request.params.id,
        request.body,
      );
      reply.status(201).send(dto);
    },
  );

  r.post(
    "/inspection-items/:id/evidences",
    {
      preHandler: execute,
      schema: { params: idParams, body: createEvidenceInput, response: { 201: evidenceDto } },
    },
    async (request, reply) => {
      const tenantId = requireTenant(request);
      const dto = await service.createEvidence(
        request.tx,
        tenantId,
        request.params.id,
        request.body,
      );
      reply.status(201).send(dto);
    },
  );
}
