import { NextResponse } from "next/server";
import { loginInput } from "@vistoria/contracts";
import { createWebApi } from "@/lib/web-api";
import { getApiUrl } from "@/lib/env";
import {
  SESSION_COOKIE,
  encodeSession,
  isWebRoleAllowed,
} from "@/lib/session";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (refresh-token lifetime)

export async function POST(request: Request): Promise<Response> {
  const json = await request.json().catch(() => null);
  const parsed = loginInput.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { code: "invalid_body", message: "Email e senha são obrigatórios" },
      { status: 400 },
    );
  }

  const api = createWebApi(getApiUrl(), () => null);
  let tokens;
  try {
    tokens = await api.base.auth.login(parsed.data);
  } catch {
    return NextResponse.json(
      { code: "invalid_credentials", message: "Credenciais inválidas" },
      { status: 401 },
    );
  }

  const authed = createWebApi(getApiUrl(), () => tokens.accessToken);
  const me = await authed.base.auth.me();

  if (!isWebRoleAllowed(me.role)) {
    return NextResponse.json(
      { code: "role_forbidden", message: "Vistoriadores usam o app mobile" },
      { status: 403 },
    );
  }

  const value = encodeSession({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    role: me.role,
    tenantId: me.tenantId,
  });

  const res = NextResponse.json({ ok: true, accessToken: tokens.accessToken, role: me.role, name: me.name });
  res.cookies.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}

export async function DELETE(): Promise<Response> {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
