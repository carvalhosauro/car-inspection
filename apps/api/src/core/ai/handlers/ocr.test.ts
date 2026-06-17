import { describe, it, expect, vi, beforeEach } from "vitest";

const { annotateText } = vi.hoisted(() => ({ annotateText: vi.fn() }));
vi.mock("../vision", () => ({ annotateText }));

import { ocrPlateHandler } from "./ocr-plate.js";
import { ocrKmHandler } from "./ocr-km.js";

const ctx = {
  tenantId: "t",
  vehicleId: "v",
  vehicleCurrentKm: 15000,
  priorPhotoHashes: [] as string[],
};

beforeEach(() => annotateText.mockReset());

describe("ocrPlateHandler", () => {
  it("accepts and extracts a plate from OCR text", async () => {
    annotateText.mockResolvedValueOnce("placa ABC1D23");
    const out = await ocrPlateHandler({ bytes: Buffer.from([1]), config: {}, ctx });
    expect(out.accepted).toBe(true);
    expect(out.validation.plate).toBe("ABC1D23");
  });

  it("rejects when no plate is found", async () => {
    annotateText.mockResolvedValueOnce("nada aqui");
    const out = await ocrPlateHandler({ bytes: Buffer.from([1]), config: {}, ctx });
    expect(out.accepted).toBe(false);
  });

  it("returns pending when Vision throws", async () => {
    annotateText.mockRejectedValueOnce(new Error("down"));
    const out = await ocrPlateHandler({ bytes: Buffer.from([1]), config: {}, ctx });
    expect(out.accepted).toBeNull();
  });
});

describe("ocrKmHandler", () => {
  it("accepts km >= vehicle currentKm", async () => {
    annotateText.mockResolvedValueOnce("Hodometro 15234 km");
    const out = await ocrKmHandler({ bytes: Buffer.from([1]), config: {}, ctx });
    expect(out.accepted).toBe(true);
    expect(out.validation.km).toBe(15234);
  });

  it("rejects km below vehicle currentKm (sanity)", async () => {
    annotateText.mockResolvedValueOnce("12000");
    const out = await ocrKmHandler({ bytes: Buffer.from([1]), config: {}, ctx });
    expect(out.accepted).toBe(false);
    expect(out.validation.reason).toContain("km");
  });

  it("rejects when no digits found", async () => {
    annotateText.mockResolvedValueOnce("sem numeros");
    const out = await ocrKmHandler({ bytes: Buffer.from([1]), config: {}, ctx });
    expect(out.accepted).toBe(false);
  });

  it("returns pending when Vision throws", async () => {
    annotateText.mockRejectedValueOnce(new Error("down"));
    const out = await ocrKmHandler({ bytes: Buffer.from([1]), config: {}, ctx });
    expect(out.accepted).toBeNull();
  });
});
