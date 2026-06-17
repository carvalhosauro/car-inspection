import vision, { ImageAnnotatorClient, protos } from "@google-cloud/vision";

type IEntityAnnotation = protos.google.cloud.vision.v1.IEntityAnnotation;
type ILocalizedObjectAnnotation = protos.google.cloud.vision.v1.ILocalizedObjectAnnotation;

let client: ImageAnnotatorClient | undefined;
function visionClient(): ImageAnnotatorClient {
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
  try {
    const [res] = await visionClient().annotateImage({
      image: { content: image.toString("base64") },
      features: [
        { type: "LABEL_DETECTION" },
        { type: "OBJECT_LOCALIZATION" },
        { type: "SAFE_SEARCH_DETECTION" },
      ],
    });
    return {
      labels: (res.labelAnnotations ?? []).map((l: IEntityAnnotation) => ({
        description: (l.description ?? "").toLowerCase(),
        score: l.score ?? 0,
      })),
      objects: (res.localizedObjectAnnotations ?? []).map((o: ILocalizedObjectAnnotation) => ({
        name: (o.name ?? "").toLowerCase(),
        score: o.score ?? 0,
      })),
      safeSearch: {
        adult: res.safeSearchAnnotation?.adult?.toString() ?? "UNKNOWN",
        violence: res.safeSearchAnnotation?.violence?.toString() ?? "UNKNOWN",
        racy: res.safeSearchAnnotation?.racy?.toString() ?? "UNKNOWN",
      },
    };
  } catch (error) {
    console.error("Vision API error in annotatePhoto:", error);
    return {
      labels: [],
      objects: [],
      safeSearch: { adult: "UNKNOWN", violence: "UNKNOWN", racy: "UNKNOWN" },
    };
  }
}

export async function annotateText(image: Buffer): Promise<string | null> {
  try {
    const [res] = await visionClient().annotateImage({
      image: { content: image.toString("base64") },
      features: [{ type: "TEXT_DETECTION" }],
    });
    return res.fullTextAnnotation?.text ?? "";
  } catch (error) {
    console.error("Vision API error in annotateText:", error);
    return null;
  }
}
