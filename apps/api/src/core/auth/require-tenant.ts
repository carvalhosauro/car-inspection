import type { FastifyRequest } from "fastify";
import { errors } from "../errors/app-error.js";
import "./types";

export function requireTenant(request: FastifyRequest): string {
  if (request.ctx.tenantId === null) {
    throw errors.badRequest("Must belong to a tenant");
  }
  return request.ctx.tenantId;
}
