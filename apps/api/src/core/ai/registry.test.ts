import { describe, it, expect } from "vitest";
import { aiRegistry } from "./registry";

const baseCtx = {
  tenantId: "00000000-0000-7000-8000-0000000000aa",
  vehicleId: "00000000-0000-7000-8000-0000000000bb",
  vehicleCurrentKm: 15000,
  priorPhotoHashes: [] as string[],
};

describe("aiRegistry", () => {
  it("has a handler for every proof kind in the registry", () => {
    for (const kind of ["photo", "ocr_plate", "ocr_km", "geo", "unique_code"]) {
      expect(typeof aiRegistry[kind as keyof typeof aiRegistry]).toBe("function");
    }
  });

  it("geo accepts when lat/lng present", async () => {
    const out = await aiRegistry.geo({
      value: { lat: -3.1, lng: -60.0 },
      config: {},
      ctx: baseCtx,
    });
    expect(out.accepted).toBe(true);
  });

  it("geo rejects when lat/lng missing", async () => {
    const out = await aiRegistry.geo({ value: {}, config: {}, ctx: baseCtx });
    expect(out.accepted).toBe(false);
    expect(out.validation.reason).toBeDefined();
  });

  it("unique_code accepts whatever server value it is given", async () => {
    const out = await aiRegistry.unique_code({
      value: { code: "VST-demo-01HXYZ" },
      config: {},
      ctx: baseCtx,
    });
    expect(out.accepted).toBe(true);
  });
});
