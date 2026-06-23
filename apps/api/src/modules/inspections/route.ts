import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createInspectionInput,
  inspectionDto,
  inspectionItemDto,
  auditInput,
  paginationQuerySchema,
  pageSchema,
} from "@vistoria/contracts";
import { requireRole } from "../../core/auth/require-role.js";
import { requireTenant } from "../../core/auth/require-tenant.js";
import * as service from "./service.js";

const idParams = z.object({ id: z.string().uuid() });
const listQuery = paginationQuerySchema.extend({
  status: z.string().optional(),
  inspector: z.string().uuid().optional(),
  vehicle: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export async function inspectionRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();
  const manage = requireRole(["gestor", "supervisor"]);
  const execute = requireRole(["gestor", "supervisor", "vistoriador"]);

  r.post(
    "/inspections",
    { preHandler: manage, schema: { body: createInspectionInput, response: { 201: inspectionDto } } },
    async (request, reply) => {
      const tenantId = requireTenant(request);
      const dto = await service.create(request.tx, tenantId, request.body);
      reply.status(201).send(dto);
    },
  );

  r.get(
    "/inspections",
    { preHandler: manage, schema: { querystring: listQuery, response: { 200: pageSchema(inspectionDto) } } },
    async (request) => {
      const tenantId = requireTenant(request);
      const q = request.query;
      return service.list(
        request.tx,
        tenantId,
        {
          status: q.status,
          inspectorId: q.inspector,
          vehicleId: q.vehicle,
          from: q.from ? new Date(q.from) : undefined,
          to: q.to ? new Date(q.to) : undefined,
        },
        q,
      );
    },
  );

  r.get(
    "/inspections/:id",
    { preHandler: execute, schema: { params: idParams, response: { 200: inspectionDto } } },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.getById(request.tx, tenantId, request.params.id);
    },
  );

  r.get(
    "/inspections/:id/audit",
    {
      preHandler: manage,
      schema: {
        params: idParams,
        response: {
          200: z.object({
            auditedBy: z.string().uuid().nullable(),
            auditNote: z.string().nullable(),
            auditedAt: z.string().datetime().nullable(),
            result: z.enum(["conforme", "com_pendencias"]).nullable(),
          }),
        },
      },
    },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.getAudit(request.tx, tenantId, request.params.id);
    },
  );

  r.patch(
    "/inspections/:id/audit",
    { preHandler: manage, schema: { params: idParams, body: auditInput, response: { 200: inspectionDto } } },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.audit(request.tx, tenantId, request.params.id, request.ctx.userId, request.body);
    },
  );

  r.post(
    "/inspections/:id/start",
    { preHandler: execute, schema: { params: idParams, response: { 200: inspectionDto } } },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.start(request.tx, tenantId, request.params.id);
    },
  );

  r.get(
    "/inspections/:id/items",
    { preHandler: execute, schema: { params: idParams, response: { 200: z.array(inspectionItemDto) } } },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.items(request.tx, tenantId, request.params.id);
    },
  );

  r.post(
    "/inspections/:id/finish",
    {
      preHandler: execute,
      schema: {
        params: idParams,
        body: z.object({ geoLat: z.number(), geoLng: z.number() }),
        response: { 200: inspectionDto },
      },
    },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.finish(request.tx, tenantId, request.params.id, request.body);
    },
  );

  r.get(
    "/me/inspections",
    {
      preHandler: execute,
      schema: {
        querystring: z.object({ date: z.string().optional() }),
        response: { 200: z.object({ items: z.array(inspectionDto) }) },
      },
    },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.myToday(request.tx, request.ctx.userId);
    },
  );

  r.get(
    "/me/inspections/history",
    { preHandler: execute, schema: { querystring: paginationQuerySchema, response: { 200: pageSchema(inspectionDto) } } },
    async (request) => {
      const tenantId = requireTenant(request);
      return service.myHistory(request.tx, tenantId, request.ctx.userId, request.query);
    },
  );
}
