import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createChecklistTemplateInput,
  checklistTemplateDto,
  checklistItemDto,
  requirementDto,
  PROOF_KINDS,
  paginationQuerySchema,
  pageSchema,
} from "@vistoria/contracts";
import { requireRole } from "../../core/auth/require-role.js";
import { requireTenant } from "../../core/auth/require-tenant.js";
import * as service from "./service.js";

const createItemBody = z.object({
  label: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().default(0),
  requirements: z
    .array(
      z.object({
        kind: z.enum(PROOF_KINDS),
        required: z.boolean().default(true),
        config: z.record(z.unknown()).optional(),
        order: z.number().int().default(0),
      }),
    )
    .default([]),
});

const patchItemBody = z.object({
  label: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().int().optional(),
});

const createRequirementBody = z.object({
  kind: z.enum(PROOF_KINDS),
  required: z.boolean().default(true),
  config: z.record(z.unknown()).optional(),
  order: z.number().int().default(0),
});

export async function checklistRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();
  const guard = requireRole(["gestor"]);
  // Supervisors assign inspections, so they need to read templates to pick one.
  const readGuard = requireRole(["gestor", "supervisor"]);
  const idParams = z.object({ id: z.string().uuid() });

  r.post(
    "/checklist-templates",
    {
      preHandler: guard,
      schema: { body: createChecklistTemplateInput, response: { 201: checklistTemplateDto } },
    },
    async (request, reply) => {
      const tenantId = requireTenant(request);
      const dto = await service.createTemplate(request.tx, tenantId, request.body);
      reply.code(201);
      return dto;
    },
  );

  r.get(
    "/checklist-templates",
    {
      preHandler: readGuard,
      schema: {
        querystring: paginationQuerySchema,
        response: { 200: pageSchema(checklistTemplateDto) },
      },
    },
    async (request) => service.listTemplates(request.tx, request.query),
  );

  r.get(
    "/checklist-templates/:id",
    { preHandler: readGuard, schema: { params: idParams, response: { 200: checklistTemplateDto } } },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.getTemplateDto(request.tx, tenantId, request.params.id);
    },
  );

  r.post(
    "/checklist-templates/:id/items",
    {
      preHandler: guard,
      schema: { params: idParams, body: createItemBody, response: { 201: checklistItemDto } },
    },
    async (request, reply) => {
      const tenantId = requireTenant(request);
      const dto = await service.addItem(
        request.tx,
        tenantId,
        request.params.id,
        request.body,
      );
      reply.code(201);
      return dto;
    },
  );

  r.patch(
    "/checklist-items/:id",
    {
      preHandler: guard,
      schema: { params: idParams, body: patchItemBody, response: { 200: checklistItemDto } },
    },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.patchItem(request.tx, tenantId, request.params.id, request.body);
    },
  );

  r.post(
    "/checklist-items/:id/requirements",
    {
      preHandler: guard,
      schema: { params: idParams, body: createRequirementBody, response: { 201: requirementDto } },
    },
    async (request, reply) => {
      const tenantId = requireTenant(request);
      const dto = await service.addRequirement(
        request.tx,
        tenantId,
        request.params.id,
        request.body,
      );
      reply.code(201);
      return dto;
    },
  );

  r.delete(
    "/checklist-items/:id/requirements/:rid",
    {
      preHandler: guard,
      schema: { params: z.object({ id: z.string().uuid(), rid: z.string().uuid() }) },
    },
    async (request, reply) => {
      await service.removeRequirement(request.tx, request.params.id, request.params.rid);
      reply.code(204);
      return null;
    },
  );
}
