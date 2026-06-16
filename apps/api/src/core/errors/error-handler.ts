import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { AppError } from "./app-error";

interface ErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (error instanceof AppError) {
    const body: ErrorBody = { code: error.code, message: error.message };
    if (error.details !== undefined) body.details = error.details;
    reply.status(error.status).send(body);
    return;
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    reply.status(400).send({
      code: "validation_error",
      message: "Request validation failed",
      details: error.validation,
    });
    return;
  }

  if (error.statusCode === 401) {
    reply.status(401).send({ code: "unauthorized", message: error.message });
    return;
  }

  if (error.statusCode === 429) {
    reply.status(429).send({ code: "rate_limited", message: error.message });
    return;
  }

  request.log.error(error);
  reply.status(500).send({ code: "internal_error", message: "Internal server error" });
}
