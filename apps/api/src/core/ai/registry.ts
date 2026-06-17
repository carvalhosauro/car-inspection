import type { ProofKind } from "@vistoria/contracts";
import { geoHandler } from "./handlers/geo.js";
import { uniqueCodeHandler } from "./handlers/unique-code.js";
import { photoHandler } from "./handlers/photo.js";
import { ocrPlateHandler } from "./handlers/ocr-plate.js";
import { ocrKmHandler } from "./handlers/ocr-km.js";

/** Context every handler may read about the inspection being evidenced. */
export interface HandlerCtx {
  tenantId: string;
  vehicleId: string;
  vehicleCurrentKm: number;
  /** pHashes of prior accepted photo evidences for THIS vehicle (dedup). */
  priorPhotoHashes: string[];
}

export interface HandlerInput {
  bytes?: Buffer;
  value?: Record<string, unknown>;
  config: Record<string, unknown>;
  ctx: HandlerCtx;
}

export interface HandlerResult {
  /** true = accepted, false = rejected, null = pending (Vision down). */
  accepted: boolean | null;
  validation: Record<string, unknown>;
}

export type ProofHandler = (input: HandlerInput) => Promise<HandlerResult>;

export const aiRegistry: Record<ProofKind, ProofHandler> = {
  photo: photoHandler,
  ocr_plate: ocrPlateHandler,
  ocr_km: ocrKmHandler,
  geo: geoHandler,
  unique_code: uniqueCodeHandler,
  signature: geoHandler, // signature is out of MVP scope; reuse a presence check
};
