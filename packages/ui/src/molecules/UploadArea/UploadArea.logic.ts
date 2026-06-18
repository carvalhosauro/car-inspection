export type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

export const MAX_BYTES = 10 * 1024 * 1024;
export const ACCEPTED = ["image/png", "image/jpeg"] as const;

export function validateFile(
  f: { type: string; size: number }
): { ok: true } | { ok: false; reason: string } {
  if (!ACCEPTED.includes(f.type as (typeof ACCEPTED)[number])) {
    return { ok: false, reason: "Formato não suportado (use PNG ou JPG)" };
  }
  if (f.size > MAX_BYTES) {
    return { ok: false, reason: "Arquivo excede 10MB" };
  }
  return { ok: true };
}

export interface UploadAreaProps {
  state?: UploadState;
  onFiles?: (files: File[]) => void;
}
