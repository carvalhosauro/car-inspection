import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserRole } from "@vistoria/contracts";
import { errors } from "../errors/app-error.js";
import "./types.js";

export function requireRole(roles: readonly UserRole[]) {
  return async function preHandler(
    request: FastifyRequest,
    _reply: FastifyReply,
  ): Promise<void> {
    if (!roles.includes(request.ctx.role)) {
      throw errors.forbidden("Insufficient role for this action");
    }
  };
}
