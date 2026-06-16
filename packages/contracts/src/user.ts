import { z } from "zod";
import { USER_ROLES } from "./enums";

export const userDto = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid().nullable(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(USER_ROLES),
  active: z.boolean(),
  createdAt: z.string().datetime(),
});
export type UserDto = z.infer<typeof userDto>;

export const createUserInput = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["supervisor", "vistoriador"]),
});
export type CreateUserInput = z.infer<typeof createUserInput>;

export const updateUserInput = createUserInput.partial().omit({ password: true });
export type UpdateUserInput = z.infer<typeof updateUserInput>;
