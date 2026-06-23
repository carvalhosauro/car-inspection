import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginInput, tokenPair, refreshInput, meOutput } from "@vistoria/contracts";
import { z } from "zod";
import * as service from "./service.js";

const LOGIN_RATE_LIMIT_MAX = 10;
const REFRESH_RATE_LIMIT_MAX = 20;
const AUTH_RATE_LIMIT_WINDOW = "1 minute";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.post(
    "/login",
    {
      config: { rateLimit: { max: LOGIN_RATE_LIMIT_MAX, timeWindow: AUTH_RATE_LIMIT_WINDOW } },
      schema: { body: loginInput, response: { 200: tokenPair } },
    },
    async (request) => service.login(request.body),
  );

  r.post(
    "/refresh",
    {
      config: { rateLimit: { max: REFRESH_RATE_LIMIT_MAX, timeWindow: AUTH_RATE_LIMIT_WINDOW } },
      schema: { body: refreshInput, response: { 200: z.object({ accessToken: z.string() }) } },
    },
    async (request) => service.refresh(request.body.refreshToken),
  );

  r.post("/logout", async (_request, reply) => {
    // Stateless JWT: client discards tokens. Reset of refresh cookies is client-side.
    return reply.status(204).send();
  });

  r.get("/me", { schema: { response: { 200: meOutput } } }, async (request) =>
    service.me(request.ctx.userId),
  );
}
