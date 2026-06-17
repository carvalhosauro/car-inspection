import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { perceptualHash, hammingDistance } from "./phash.js";

async function solid(color: { r: number; g: number; b: number }) {
  return sharp({
    create: { width: 64, height: 64, channels: 3, background: color },
  })
    .png()
    .toBuffer();
}

describe("phash", () => {
  it("hammingDistance is 0 for identical hashes", () => {
    expect(hammingDistance("ffff0000", "ffff0000")).toBe(0);
  });

  it("hammingDistance counts differing bits", () => {
    expect(hammingDistance("00", "ff")).toBe(8);
  });

  it("produces a stable hash for the same image", async () => {
    const img = await solid({ r: 10, g: 200, b: 50 });
    const a = await perceptualHash(img);
    const b = await perceptualHash(img);
    expect(a).toBe(b);
    expect(hammingDistance(a, b)).toBe(0);
  });

  it("distinct images differ in hash", async () => {
    const a = await perceptualHash(await solid({ r: 0, g: 0, b: 0 }));
    const b = await perceptualHash(await solid({ r: 255, g: 255, b: 255 }));
    expect(a).not.toBe(b);
  });
});
