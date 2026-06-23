import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWebApi } from "./web-api";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("createWebApi", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("GETs the reports summary with a bearer token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ inspections: 3 }));
    vi.stubGlobal("fetch", fetchMock);
    const api = createWebApi("http://api.test", () => "tok");

    const out = await api.reports.summary();

    expect(out).toEqual({ inspections: 3 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("http://api.test/v1/reports/summary");
    expect(init.method).toBe("GET");
    expect(init.headers.authorization).toBe("Bearer tok");
  });

  it("PATCHes an inspection audit decision", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: "i1", status: "aprovada" }));
    vi.stubGlobal("fetch", fetchMock);
    const api = createWebApi("http://api.test", () => "tok");

    await api.inspections.audit("i1", { decision: "aprovada", auditNote: "ok" });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("http://api.test/v1/inspections/i1/audit");
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body)).toEqual({ decision: "aprovada", auditNote: "ok" });
  });

  it("soft-deletes a vehicle via DELETE", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const api = createWebApi("http://api.test", () => "tok");

    await api.vehicles.remove("v1");

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("http://api.test/v1/vehicles/v1");
    expect(init.method).toBe("DELETE");
  });
});
