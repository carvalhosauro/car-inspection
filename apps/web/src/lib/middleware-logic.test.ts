import { describe, it, expect } from "vitest";
import { decideRedirect } from "./middleware-logic";
import { encodeSession } from "./session";

const gestorCookie = encodeSession({
  accessToken: "a",
  refreshToken: "r",
  role: "gestor",
  tenantId: "t1",
});
const vistoriadorCookie = encodeSession({
  accessToken: "a",
  refreshToken: "r",
  role: "vistoriador",
  tenantId: "t1",
});

describe("decideRedirect", () => {
  it("lets an authenticated gestor into the dashboard", () => {
    expect(decideRedirect("/dashboard", gestorCookie)).toBeNull();
  });

  it("redirects an anonymous user from the dashboard to /login", () => {
    expect(decideRedirect("/dashboard", undefined)).toBe("/login");
  });

  it("redirects a vistoriador out of the dashboard to /login", () => {
    expect(decideRedirect("/vehicles", vistoriadorCookie)).toBe("/login");
  });

  it("redirects an already-authenticated user away from /login to /dashboard", () => {
    expect(decideRedirect("/login", gestorCookie)).toBe("/dashboard");
  });

  it("leaves an anonymous user on /login", () => {
    expect(decideRedirect("/login", undefined)).toBeNull();
  });
});
