import { describe, it, expect } from "vitest";
import { createInspectionInput, createEvidenceInput, auditInput } from "./inspection";

const VEHICLE_ID = "00000000-0000-4000-a000-000000000001";
const TEMPLATE_ID = "00000000-0000-4000-a000-000000000002";
const INSPECTOR_ID = "00000000-0000-4000-a000-000000000003";
const REQUIREMENT_ID = "00000000-0000-4000-a000-000000000004";

describe("createInspectionInput", () => {
  it("parses a valid inspection input", () => {
    const parsed = createInspectionInput.parse({
      vehicleId: VEHICLE_ID,
      templateId: TEMPLATE_ID,
      inspectorId: INSPECTOR_ID,
      type: "retirada",
    });
    expect(parsed.vehicleId).toBe(VEHICLE_ID);
    expect(parsed.type).toBe("retirada");
    expect(parsed.scheduledFor).toBeUndefined();
  });

  it("parses with optional scheduledFor datetime", () => {
    const parsed = createInspectionInput.parse({
      vehicleId: VEHICLE_ID,
      templateId: TEMPLATE_ID,
      inspectorId: INSPECTOR_ID,
      type: "devolucao",
      scheduledFor: "2026-07-01T10:00:00.000Z",
    });
    expect(parsed.scheduledFor).toBe("2026-07-01T10:00:00.000Z");
  });

  it("accepts all valid inspection types", () => {
    for (const type of ["retirada", "devolucao", "periodica"] as const) {
      const parsed = createInspectionInput.parse({
        vehicleId: VEHICLE_ID,
        templateId: TEMPLATE_ID,
        inspectorId: INSPECTOR_ID,
        type,
      });
      expect(parsed.type).toBe(type);
    }
  });

  it("rejects invalid inspection type", () => {
    expect(() =>
      createInspectionInput.parse({
        vehicleId: VEHICLE_ID,
        templateId: TEMPLATE_ID,
        inspectorId: INSPECTOR_ID,
        type: "revisao",
      })
    ).toThrow();
  });

  it("rejects non-uuid vehicleId", () => {
    expect(() =>
      createInspectionInput.parse({
        vehicleId: "not-a-uuid",
        templateId: TEMPLATE_ID,
        inspectorId: INSPECTOR_ID,
        type: "retirada",
      })
    ).toThrow();
  });

  it("rejects missing required fields", () => {
    expect(() => createInspectionInput.parse({ type: "retirada" })).toThrow();
  });
});

describe("createEvidenceInput", () => {
  it("parses valid evidence with required fields only", () => {
    const parsed = createEvidenceInput.parse({
      kind: "photo",
      idempotencyKey: "key-abc-123",
    });
    expect(parsed.kind).toBe("photo");
    expect(parsed.idempotencyKey).toBe("key-abc-123");
  });

  it("parses evidence with all optional fields", () => {
    const parsed = createEvidenceInput.parse({
      kind: "ocr_plate",
      requirementId: REQUIREMENT_ID,
      filePath: "/uploads/plate.jpg",
      value: { plate: "ABC1D23" },
      idempotencyKey: "key-xyz-456",
    });
    expect(parsed.requirementId).toBe(REQUIREMENT_ID);
    expect(parsed.filePath).toBe("/uploads/plate.jpg");
  });

  it("rejects empty idempotencyKey", () => {
    expect(() =>
      createEvidenceInput.parse({ kind: "photo", idempotencyKey: "" })
    ).toThrow();
  });

  it("rejects invalid proof kind", () => {
    expect(() =>
      createEvidenceInput.parse({ kind: "unknown", idempotencyKey: "k1" })
    ).toThrow();
  });
});

describe("auditInput", () => {
  it("parses valid decision 'aprovada'", () => {
    const parsed = auditInput.parse({ decision: "aprovada" });
    expect(parsed.decision).toBe("aprovada");
  });

  it("parses valid decision 'reprovada'", () => {
    const parsed = auditInput.parse({ decision: "reprovada" });
    expect(parsed.decision).toBe("reprovada");
  });

  it("parses with optional auditNote", () => {
    const parsed = auditInput.parse({ decision: "reprovada", auditNote: "Dano no painel" });
    expect(parsed.auditNote).toBe("Dano no painel");
  });

  it("rejects invalid audit decision", () => {
    expect(() => auditInput.parse({ decision: "pendente" })).toThrow();
  });

  it("rejects missing decision", () => {
    expect(() => auditInput.parse({})).toThrow();
  });
});
