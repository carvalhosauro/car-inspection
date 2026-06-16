import { describe, it, expect } from "vitest";
import { AppError, errors } from "./app-error";

describe("AppError", () => {
  it("carries code, message, details and status", () => {
    const e = new AppError(404, "not_found", "missing", { id: "x" });
    expect(e.status).toBe(404);
    expect(e.code).toBe("not_found");
    expect(e.message).toBe("missing");
    expect(e.details).toEqual({ id: "x" });
  });

  it("named helper produces the right status + code", () => {
    const e = errors.forbidden("no access");
    expect(e.status).toBe(403);
    expect(e.code).toBe("forbidden");
    expect(e.message).toBe("no access");
  });

  it("conflict defaults its message", () => {
    const e = errors.conflict();
    expect(e.status).toBe(409);
    expect(e.code).toBe("conflict");
    expect(typeof e.message).toBe("string");
  });
});
