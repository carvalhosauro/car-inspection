import { describe, it, expect } from "vitest";
import {
  createChecklistTemplateInput,
  createChecklistItemInput,
  createRequirementInput,
} from "./checklist";

describe("createRequirementInput", () => {
  it("parses a valid requirement with required fields", () => {
    const parsed = createRequirementInput.parse({ kind: "photo" });
    expect(parsed.kind).toBe("photo");
    expect(parsed.required).toBe(true);
    expect(parsed.order).toBe(0);
  });

  it("accepts all known proof kinds", () => {
    for (const kind of ["photo", "ocr_plate", "ocr_km", "geo", "unique_code"] as const) {
      const parsed = createRequirementInput.parse({ kind });
      expect(parsed.kind).toBe(kind);
    }
  });

  it("rejects unknown proof kind", () => {
    expect(() => createRequirementInput.parse({ kind: "fingerprint" })).toThrow();
  });
});

describe("createChecklistItemInput", () => {
  it("parses a valid item with label", () => {
    const parsed = createChecklistItemInput.parse({ label: "Check exterior" });
    expect(parsed.label).toBe("Check exterior");
    expect(parsed.order).toBe(0);
    expect(parsed.requirements).toEqual([]);
  });

  it("parses item with requirements array", () => {
    const parsed = createChecklistItemInput.parse({
      label: "Tire check",
      requirements: [{ kind: "photo" }],
    });
    expect(parsed.requirements).toHaveLength(1);
    expect(parsed.requirements[0]!.kind).toBe("photo");
  });

  it("rejects empty label", () => {
    expect(() => createChecklistItemInput.parse({ label: "" })).toThrow();
  });

  it("rejects missing label", () => {
    expect(() => createChecklistItemInput.parse({})).toThrow();
  });
});

describe("createChecklistTemplateInput", () => {
  it("parses a valid template with name only", () => {
    const parsed = createChecklistTemplateInput.parse({ name: "Vistoria de Retirada" });
    expect(parsed.name).toBe("Vistoria de Retirada");
    expect(parsed.items).toEqual([]);
  });

  it("parses a template with items", () => {
    const parsed = createChecklistTemplateInput.parse({
      name: "Template Completo",
      items: [
        {
          label: "Exterior",
          requirements: [{ kind: "photo" }],
        },
      ],
    });
    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0]!.label).toBe("Exterior");
  });

  it("rejects empty name", () => {
    expect(() => createChecklistTemplateInput.parse({ name: "" })).toThrow();
  });

  it("rejects missing name", () => {
    expect(() => createChecklistTemplateInput.parse({})).toThrow();
  });

  it("rejects item with invalid requirement kind", () => {
    expect(() =>
      createChecklistTemplateInput.parse({
        name: "Bad Template",
        items: [{ label: "Step", requirements: [{ kind: "invalid_kind" }] }],
      })
    ).toThrow();
  });
});
