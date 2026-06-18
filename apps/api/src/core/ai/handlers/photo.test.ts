import { describe, it, expect, vi, beforeEach } from "vitest";

const { annotatePhoto, perceptualHash } = vi.hoisted(() => ({
  annotatePhoto: vi.fn(),
  perceptualHash: vi.fn(),
}));

vi.mock("../vision", () => ({ annotatePhoto }));
vi.mock("../phash", async () => {
  const actual = await vi.importActual<typeof import("../phash")>("../phash");
  return { perceptualHash, hammingDistance: actual.hammingDistance };
});

import { photoHandler } from "./photo.js";

const ctx = {
  tenantId: "t",
  vehicleId: "v",
  vehicleCurrentKm: 0,
  priorPhotoHashes: [] as string[],
};

beforeEach(() => {
  annotatePhoto.mockReset();
  perceptualHash.mockReset();
});

describe("photoHandler", () => {
  it("accepts a sharp photo whose label matches and is unique", async () => {
    annotatePhoto.mockResolvedValueOnce({
      labels: [{ description: "bumper", score: 0.9 }],
      objects: [{ name: "car", score: 0.8 }],
      safeSearch: { adult: "VERY_UNLIKELY", violence: "VERY_UNLIKELY", racy: "UNLIKELY" },
    });
    perceptualHash.mockResolvedValueOnce("aaaa");
    const out = await photoHandler({
      bytes: Buffer.from([1]),
      config: { expectedLabels: ["bumper"] },
      ctx: { ...ctx, priorPhotoHashes: ["ffff"] },
    });
    expect(out.accepted).toBe(true);
    expect(out.validation.dedupHash).toBe("aaaa");
  });

  it("rejects when the expected label is missing", async () => {
    annotatePhoto.mockResolvedValueOnce({
      labels: [{ description: "tree", score: 0.9 }],
      objects: [],
      safeSearch: { adult: "VERY_UNLIKELY", violence: "VERY_UNLIKELY", racy: "UNLIKELY" },
    });
    perceptualHash.mockResolvedValueOnce("aaaa");
    const out = await photoHandler({
      bytes: Buffer.from([1]),
      config: { expectedLabels: ["bumper"] },
      ctx,
    });
    expect(out.accepted).toBe(false);
    expect(out.validation.reason).toContain("item errado");
  });

  it("rejects a duplicate photo (low hamming distance)", async () => {
    annotatePhoto.mockResolvedValueOnce({
      labels: [{ description: "bumper", score: 0.9 }],
      objects: [],
      safeSearch: { adult: "VERY_UNLIKELY", violence: "VERY_UNLIKELY", racy: "UNLIKELY" },
    });
    perceptualHash.mockResolvedValueOnce("aaaa");
    const out = await photoHandler({
      bytes: Buffer.from([1]),
      config: { expectedLabels: ["bumper"] },
      ctx: { ...ctx, priorPhotoHashes: ["aaaa"] },
    });
    expect(out.accepted).toBe(false);
    expect(out.validation.reason).toContain("duplicada");
  });

  it("rejects unsafe content", async () => {
    annotatePhoto.mockResolvedValueOnce({
      labels: [{ description: "bumper", score: 0.9 }],
      objects: [],
      safeSearch: { adult: "LIKELY", violence: "VERY_UNLIKELY", racy: "UNLIKELY" },
    });
    perceptualHash.mockResolvedValueOnce("aaaa");
    const out = await photoHandler({
      bytes: Buffer.from([1]),
      config: { expectedLabels: ["bumper"] },
      ctx,
    });
    expect(out.accepted).toBe(false);
  });

  it("returns pending (accepted=null) when Vision throws", async () => {
    annotatePhoto.mockRejectedValueOnce(new Error("vision down"));
    const out = await photoHandler({
      bytes: Buffer.from([1]),
      config: { expectedLabels: ["bumper"] },
      ctx,
    });
    expect(out.accepted).toBeNull();
    expect(out.validation.reason).toContain("pendente");
  });

  it("returns pending when bytes are absent", async () => {
    const out = await photoHandler({ config: {}, ctx });
    expect(out.accepted).toBeNull();
  });
});
