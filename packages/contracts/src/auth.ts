import { z } from "zod";
import { USER_ROLES } from "./enums";

export const passwordSchema = z.string().min(6);

export const loginInput = z.object({
  email: z.string().email(),
  password: passwordSchema,
});
export type LoginInput = z.infer<typeof loginInput>;

export const tokenPair = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type TokenPair = z.infer<typeof tokenPair>;

export const refreshInput = z.object({ refreshToken: z.string() });

export const meOutput = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid().nullable(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(USER_ROLES),
});
export type MeOutput = z.infer<typeof meOutput>;

// Decoded JWT access-token payload — imported by the API guard.
export const jwtPayload = z.object({
  sub: z.string().uuid(),
  tenantId: z.string().uuid().nullable(),
  role: z.enum(USER_ROLES),
});
export type JwtPayload = z.infer<typeof jwtPayload>;
