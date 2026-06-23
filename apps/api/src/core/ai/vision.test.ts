import { describe, it, expect, vi } from "vitest";

const annotateImage = vi.fn();

vi.mock("@google-cloud/vision", () => ({
  default: { ImageAnnotatorClient: vi.fn(() => ({ annotateImage })) },
  ImageAnnotatorClient: vi.fn(() => ({ annotateImage })),
}));

import { annotatePhoto, annotateText } from "./vision.js";

describe("vision", () => {
  it("annotatePhoto returns labels, objects and safeSearch", async () => {
    annotateImage.mockResolvedValueOnce([
      {
        labelAnnotations: [{ description: "Bumper", score: 0.95 }],
        localizedObjectAnnotations: [{ name: "Car", score: 0.9 }],
        safeSearchAnnotation: { adult: "VERY_UNLIKELY", violence: "UNLIKELY" },
      },
    ]);
    const out = await annotatePhoto(Buffer.from([1]));
    expect(out.labels[0]).toEqual({ description: "bumper", score: 0.95 });
    expect(out.objects[0]).toEqual({ name: "car", score: 0.9 });
    expect(out.safeSearch.adult).toBe("VERY_UNLIKELY");
  });

  it("annotateText returns the full OCR text", async () => {
    annotateImage.mockResolvedValueOnce([
      { fullTextAnnotation: { text: "ABC1D23\n45000 km" } },
    ]);
    const out = await annotateText(Buffer.from([1]));
    expect(out).toBe("ABC1D23\n45000 km");
  });

  it("annotateText returns null when Vision API throws", async () => {
    annotateImage.mockRejectedValueOnce(new Error("Vision API error"));
    const out = await annotateText(Buffer.from([1]));
    expect(out).toBeNull();
  });

  it("annotatePhoto propagates Vision API errors to the caller", async () => {
    annotateImage.mockRejectedValueOnce(new Error("Vision API error"));
    await expect(annotatePhoto(Buffer.from([1]))).rejects.toThrow("Vision API error");
  });
});
