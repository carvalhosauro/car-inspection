import { describe, it, expect } from "vitest";
import { validateFile, MAX_BYTES } from "./UploadArea.logic";

describe("validateFile", () => {
  it("accepts a small png", () => {
    expect(validateFile({ type: "image/png", size: 1024 })).toEqual({ ok: true });
  });
  it("accepts jpeg", () => {
    expect(validateFile({ type: "image/jpeg", size: 1024 }).ok).toBe(true);
  });
  it("rejects unsupported type", () => {
    const r = validateFile({ type: "application/pdf", size: 10 });
    expect(r).toEqual({ ok: false, reason: "Formato não suportado (use PNG ou JPG)" });
  });
  it("rejects files over 10MB", () => {
    const r = validateFile({ type: "image/png", size: MAX_BYTES + 1 });
    expect(r).toEqual({ ok: false, reason: "Arquivo excede 10MB" });
  });
});
