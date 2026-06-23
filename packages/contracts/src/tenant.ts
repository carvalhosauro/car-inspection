import { z } from "zod";
import { passwordSchema } from "./auth";

export const tenantDto = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  active: z.boolean(),
  createdAt: z.string().datetime(),
});
export type TenantDto = z.infer<typeof tenantDto>;

export const createTenantInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  gestor: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: passwordSchema,
  }),
});
export type CreateTenantInput = z.infer<typeof createTenantInput>;
