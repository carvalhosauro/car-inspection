import type { ProofHandler } from "../registry.js";

export const geoHandler: ProofHandler = async ({ value }) => {
  const lat = (value as { lat?: unknown } | undefined)?.lat;
  const lng = (value as { lng?: unknown } | undefined)?.lng;
  if (typeof lat === "number" && typeof lng === "number") {
    return { accepted: true, validation: { lat, lng } };
  }
  return { accepted: false, validation: { reason: "geo ausente (lat/lng)" } };
};
