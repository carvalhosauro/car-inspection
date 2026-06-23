import { describe, it, expect, vi, beforeEach } from "vitest";

const loginMock = vi.fn();
const meMock = vi.fn();

vi.mock("@/lib/web-api", () => ({
  createWebApi: () => ({ base: { auth: { login: loginMock, me: meMock } } }),
}));
vi.mock("@/lib/env", () => ({ getApiUrl: () => "http://api.test" }));

import { POST, DELETE } from "./route";

function req(body: unknown): Request {
  return new Request("http://web.test/api/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/session", () => {
  beforeEach(() => {
    loginMock.mockReset();
    meMock.mockReset();
  });

  it("sets an httpOnly session cookie for a gestor login", async () => {
    loginMock.mockResolvedValue({ accessToken: "a.b.c", refreshToken: "r.e.f" });
    meMock.mockResolvedValue({
      id: "u1",
      tenantId: "t1",
      name: "Gestor",
      email: "g@d.dev",
      role: "gestor",
    });

    const res = await POST(req({ email: "g@d.dev", password: "senha123" }));

    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("vistoria_session=");
    expect(setCookie.toLowerCase()).toContain("httponly");
  });

  it("rejects a vistoriador with 403 and no cookie", async () => {
    loginMock.mockResolvedValue({ accessToken: "a.b.c", refreshToken: "r.e.f" });
    meMock.mockResolvedValue({
      id: "u2",
      tenantId: "t1",
      name: "Vist",
      email: "v@d.dev",
      role: "vistoriador",
    });

    const res = await POST(req({ email: "v@d.dev", password: "senha123" }));

    expect(res.status).toBe(403);
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("clears the cookie on DELETE", async () => {
    const res = await DELETE();
    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("vistoria_session=");
    expect(setCookie.toLowerCase()).toContain("max-age=0");
  });
});
