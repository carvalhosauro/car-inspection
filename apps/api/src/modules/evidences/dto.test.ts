import { describe, it, expect } from "vitest";
import { evToDto } from "./dto.js";

const BASE_DATE = new Date("2024-03-15T10:30:00.000Z");

const fullRow = {
  id: "ev-1",
  inspectionItemId: "item-1",
  requirementId: "req-1",
  kind: "photo",
  filePath: "/uploads/photo.jpg",
  value: { hash: "abc123", width: 1920, height: 1080 },
  validation: { plate: "ABC1D23", confidence: 0.98 },
  accepted: true,
  createdAt: BASE_DATE,
};

describe("evToDto", () => {
  it("maps all fields from a fully populated row", () => {
    const dto = evToDto(fullRow);

    expect(dto.id).toBe("ev-1");
    expect(dto.inspectionItemId).toBe("item-1");
    expect(dto.requirementId).toBe("req-1");
    expect(dto.kind).toBe("photo");
    expect(dto.filePath).toBe("/uploads/photo.jpg");
    expect(dto.value).toEqual({ hash: "abc123", width: 1920, height: 1080 });
    expect(dto.validation).toEqual({ plate: "ABC1D23", confidence: 0.98 });
    expect(dto.accepted).toBe(true);
    expect(dto.createdAt).toBe("2024-03-15T10:30:00.000Z");
  });

  it("converts createdAt Date to ISO string", () => {
    const date = new Date("2025-01-01T00:00:00.000Z");
    const dto = evToDto({ ...fullRow, createdAt: date });
    expect(dto.createdAt).toBe("2025-01-01T00:00:00.000Z");
    expect(typeof dto.createdAt).toBe("string");
  });

  it("preserves null for optional filePath", () => {
    const dto = evToDto({ ...fullRow, filePath: null });
    expect(dto.filePath).toBeNull();
  });

  it("preserves null for optional requirementId", () => {
    const dto = evToDto({ ...fullRow, requirementId: null });
    expect(dto.requirementId).toBeNull();
  });

  it("preserves null for optional accepted", () => {
    const dto = evToDto({ ...fullRow, accepted: null });
    expect(dto.accepted).toBeNull();
  });

  it("defaults null value to null in dto", () => {
    const dto = evToDto({ ...fullRow, value: null });
    expect(dto.value).toBeNull();
  });

  it("defaults null validation to null in dto", () => {
    const dto = evToDto({ ...fullRow, validation: null });
    expect(dto.validation).toBeNull();
  });

  it("defaults undefined value to null in dto", () => {
    const dto = evToDto({ ...fullRow, value: undefined });
    expect(dto.value).toBeNull();
  });

  it("defaults undefined validation to null in dto", () => {
    const dto = evToDto({ ...fullRow, validation: undefined });
    expect(dto.validation).toBeNull();
  });

  it("passes kind through as ProofKind cast", () => {
    const dto = evToDto({ ...fullRow, kind: "ocr_km" });
    expect(dto.kind).toBe("ocr_km");
  });
});
