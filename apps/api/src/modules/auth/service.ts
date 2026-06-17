import type { LoginInput, TokenPair, JwtPayload, MeOutput } from "@vistoria/contracts";
import { verifyPassword } from "../../core/auth/password";
import { signAccess, signRefresh, verifyRefresh } from "../../core/auth/tokens";
import { errors } from "../../core/errors/app-error";
import { env } from "../../env";
import { findUserByEmail, findUserById } from "./repo";

export async function login(input: LoginInput): Promise<TokenPair> {
  const user = await findUserByEmail(input.email);
  if (!user || !user.active) throw errors.unauthorized("Invalid credentials");
  const ok = await verifyPassword(user.passwordHash, input.password);
  if (!ok) throw errors.unauthorized("Invalid credentials");
  const payload: JwtPayload = { sub: user.id, tenantId: user.tenantId, role: user.role };
  return {
    accessToken: signAccess(payload, env.JWT_SECRET),
    refreshToken: signRefresh(payload, env.JWT_REFRESH_SECRET),
  };
}

export async function refresh(refreshToken: string): Promise<{ accessToken: string }> {
  let payload: JwtPayload;
  try {
    payload = verifyRefresh(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    throw errors.unauthorized("Invalid refresh token");
  }
  return { accessToken: signAccess(payload, env.JWT_SECRET) };
}

export async function me(userId: string): Promise<MeOutput> {
  const user = await findUserById(userId);
  if (!user) throw errors.notFound("User not found");
  return {
    id: user.id,
    tenantId: user.tenantId,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
