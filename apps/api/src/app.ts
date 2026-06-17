import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.js";
import { errorHandler } from "./core/errors/error-handler.js";
import { authContextPlugin } from "./core/auth/auth-context.js";
import { authRoutes } from "./modules/auth/route.js";
import { tenantRoutes } from "./modules/tenants/route.js";
import { userRoutes } from "./modules/users/route.js";
import { vehicleRoutes } from "./modules/vehicles/route.js";
import { checklistRoutes } from "./modules/checklists/route.js";
import { inspectionRoutes } from "./modules/inspections/route.js";
import { evidenceRoutes } from "./modules/evidences/route.js";
import { uploadRoutes } from "./modules/uploads/route.js";
import { reportRoutes } from "./modules/reports/route.js";

const PUBLIC_ROUTES = ["/health", "/v1/auth/login", "/v1/auth/refresh"];

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);

  await app.register(cors, { origin: true, credentials: true });
  await app.register(rateLimit, { global: false, max: 10, timeWindow: "1 minute" });

  await app.register(swagger, {
    openapi: { info: { title: "Vistoria API", version: "1.0.0" } },
    transform: jsonSchemaTransform,
  });
  await app.register(swaggerUi, { routePrefix: "/docs" });

  app.get("/health", async () => ({ status: "ok" }));

  await app.register(authContextPlugin, {
    accessSecret: env.JWT_SECRET,
    publicRoutes: PUBLIC_ROUTES,
    publicPrefixes: ["/docs"],
  });

  await app.register(authRoutes, { prefix: "/v1/auth" });
  await app.register(tenantRoutes, { prefix: "/v1/tenants" });
  await app.register(userRoutes, { prefix: "/v1/users" });
  await app.register(vehicleRoutes, { prefix: "/v1/vehicles" });
  await app.register(checklistRoutes, { prefix: "/v1" });
  await app.register(inspectionRoutes, { prefix: "/v1" });
  await app.register(evidenceRoutes, { prefix: "/v1" });
  await app.register(uploadRoutes, { prefix: "/v1/uploads" });
  await app.register(reportRoutes, { prefix: "/v1/reports" });

  return app;
}
