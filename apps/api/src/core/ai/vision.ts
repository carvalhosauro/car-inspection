import vision from "@google-cloud/vision";

let client: vision.ImageAnnotatorClient | undefined;
function visionClient(): vision.ImageAnnotatorClient {
  if (!client) client = new vision.ImageAnnotatorClient();
  return client;
}

export interface Label {
  description: string;
  score: number;
}
export interface PhotoAnnotation {
  labels: Label[];
  objects: { name: string; score: number }[];
  safeSearch: Record<string, string>;
}

export async function annotatePhoto(image: Buffer): Promise<PhotoAnnotation> {
  const [res] = await visionClient().annotateImage({
    image: { content: image.toString("base64") },
    features: [
      { type: "LABEL_DETECTION" },
      { type: "OBJECT_LOCALIZATION" },
      { type: "SAFE_SEARCH_DETECTION" },
    ],
  });
  return {
    labels: (res.labelAnnotations ?? []).map((l) => ({
      description: (l.description ?? "").toLowerCase(),
      score: l.score ?? 0,
    })),
    objects: (res.localizedObjectAnnotations ?? []).map((o) => ({
      name: (o.name ?? "").toLowerCase(),
      score: o.score ?? 0,
    })),
    safeSearch: {
      adult: res.safeSearchAnnotation?.adult?.toString() ?? "UNKNOWN",
      violence: res.safeSearchAnnotation?.violence?.toString() ?? "UNKNOWN",
      racy: res.safeSearchAnnotation?.racy?.toString() ?? "UNKNOWN",
    },
  };
}

export async function annotateText(image: Buffer): Promise<string> {
  const [res] = await visionClient().annotateImage({
    image: { content: image.toString("base64") },
    features: [{ type: "TEXT_DETECTION" }],
  });
  return res.fullTextAnnotation?.text ?? "";
}
