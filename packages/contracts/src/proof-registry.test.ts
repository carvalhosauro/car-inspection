import { describe, it, expect } from "vitest";
import {
  PROOF_KINDS,
  isProofKind,
  proofConfigSchema,
  proofValueSchema,
} from "./proof-registry";

describe("proof registry", () => {
  it("lists the known kinds", () => {
    expect(PROOF_KINDS).toContain("photo");
    expect(PROOF_KINDS).toContain("ocr_plate");
    expect(PROOF_KINDS).toContain("ocr_km");
    expect(PROOF_KINDS).toContain("geo");
    expect(PROOF_KINDS).toContain("unique_code");
  });

  it("guards unknown kinds", () => {
    expect(isProofKind("photo")).toBe(true);
    expect(isProofKind("nope")).toBe(false);
  });

  it("validates photo config", () => {
    const parsed = proofConfigSchema("photo").parse({ expectedLabels: ["bumper"], minWidth: 800 });
    expect(parsed.expectedLabels).toEqual(["bumper"]);
  });

  it("validates ocr_plate value", () => {
    const parsed = proofValueSchema("ocr_plate").parse({ plate: "ABC1D23" });
    expect(parsed.plate).toBe("ABC1D23");
  });

  it("validates geo value", () => {
    const parsed = proofValueSchema("geo").parse({ lat: -3.1, lng: -60.0 });
    expect(parsed.lat).toBe(-3.1);
  });
});
