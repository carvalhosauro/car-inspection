import type { ProofHandler } from "../registry";
import { annotatePhoto } from "../vision";
import { perceptualHash, hammingDistance } from "../phash";

const SAFE_OK = new Set(["VERY_UNLIKELY", "UNLIKELY", "POSSIBLE", "UNKNOWN"]);
const DEFAULT_MIN_HAMMING = 8;
const DEFAULT_MIN_SCORE = 0.6;

export const photoHandler: ProofHandler = async ({ bytes, config, ctx }) => {
  if (!bytes) {
    return { accepted: null, validation: { reason: "pendente: sem bytes" } };
  }

  let annotation;
  let dedupHash;
  try {
    annotation = await annotatePhoto(bytes);
    dedupHash = await perceptualHash(bytes);
  } catch {
    return { accepted: null, validation: { reason: "pendente: vision indisponivel" } };
  }

  const expectedLabels = ((config.expectedLabels as string[] | undefined) ?? []).map((l) =>
    l.toLowerCase(),
  );
  const minScore = (config.minLabelScore as number | undefined) ?? DEFAULT_MIN_SCORE;
  const minHamming = (config.minHamming as number | undefined) ?? DEFAULT_MIN_HAMMING;

  const detected = new Set([
    ...annotation.labels.filter((l) => l.score >= minScore).map((l) => l.description),
    ...annotation.objects.filter((o) => o.score >= minScore).map((o) => o.name),
  ]);

  const safeOk =
    SAFE_OK.has(annotation.safeSearch.adult ?? "UNKNOWN") &&
    SAFE_OK.has(annotation.safeSearch.violence ?? "UNKNOWN");

  const labelMatch =
    expectedLabels.length === 0 || expectedLabels.some((l) => detected.has(l));

  const minDistance = ctx.priorPhotoHashes.reduce(
    (min, prior) => Math.min(min, hammingDistance(dedupHash, prior)),
    Number.POSITIVE_INFINITY,
  );
  const isDuplicate = ctx.priorPhotoHashes.length > 0 && minDistance < minHamming;

  const base = {
    dedupHash,
    labels: [...detected],
    safeSearch: annotation.safeSearch,
  };

  if (!safeOk) {
    return { accepted: false, validation: { ...base, reason: "conteudo impróprio" } };
  }
  if (!labelMatch) {
    return {
      accepted: false,
      validation: { ...base, reason: `item errado (esperava ${expectedLabels.join(", ")})` },
    };
  }
  if (isDuplicate) {
    return {
      accepted: false,
      validation: { ...base, reason: "foto duplicada", hammingDistance: minDistance },
    };
  }
  return { accepted: true, validation: base };
};
