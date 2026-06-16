import sharp from "sharp";
import { bmvbhash } from "blockhash-core";

/**
 * Perceptual hash via blockhash over a normalized 256x256 RGBA bitmap.
 * Returns a hex string; compare two with hammingDistance().
 */
export async function perceptualHash(image: Buffer): Promise<string> {
  const { data, info } = await sharp(image)
    .resize(256, 256, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const imageData = {
    width: info.width,
    height: info.height,
    data: new Uint8ClampedArray(data),
  };
  return bmvbhash(imageData, 16);
}

/** Bit-level Hamming distance between two equal-length hex hash strings. */
export function hammingDistance(a: string, b: string): number {
  const len = Math.min(a.length, b.length);
  let dist = 0;
  for (let i = 0; i < len; i++) {
    let x = parseInt(a[i]!, 16) ^ parseInt(b[i]!, 16);
    while (x) {
      dist += x & 1;
      x >>= 1;
    }
  }
  dist += Math.abs(a.length - b.length) * 4;
  return dist;
}
