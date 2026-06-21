import { submitEvidence } from "./evidence";
import type { ApiClient } from "@vistoria/api-client";
import type { EvidenceDto } from "@vistoria/contracts";

function makeClient(returned: EvidenceDto) {
  const create = jest.fn(async () => returned);
  const client = { evidences: { create } } as unknown as ApiClient;
  return { client, create };
}

const baseEvidence: EvidenceDto = {
  id: "evi-1",
  inspectionItemId: "item-1",
  requirementId: null,
  kind: "photo",
  filePath: "tenant/insp/photo-1.jpg",
  value: null,
  validation: { accepted: false, reason: "borrada" },
  accepted: false,
  createdAt: "2026-06-10T12:00:00.000Z",
};

describe("submitEvidence", () => {
  it("posts with a stable idempotency key for the same attempt", async () => {
    const { client, create } = makeClient(baseEvidence);
    await submitEvidence(client, {
      itemId: "item-1",
      kind: "photo",
      attempt: 0,
      filePath: "tenant/insp/photo-1.jpg",
    });
    expect(create).toHaveBeenCalledWith("item-1", {
      kind: "photo",
      filePath: "tenant/insp/photo-1.jpg",
      idempotencyKey: "evi:item-1:photo:0",
    });
  });

  it("includes requirementId and value when provided", async () => {
    const { client, create } = makeClient({ ...baseEvidence, kind: "ocr_plate" });
    await submitEvidence(client, {
      itemId: "item-1",
      kind: "ocr_plate",
      attempt: 0,
      requirementId: "req-9",
      value: { plate: "ABC1D23" },
    });
    expect(create).toHaveBeenCalledWith("item-1", {
      kind: "ocr_plate",
      requirementId: "req-9",
      value: { plate: "ABC1D23" },
      idempotencyKey: "evi:item-1:ocr_plate:0",
    });
  });

  it("returns the evidence DTO from the API", async () => {
    const { client } = makeClient(baseEvidence);
    const result = await submitEvidence(client, {
      itemId: "item-1",
      kind: "photo",
      attempt: 0,
      filePath: "tenant/insp/photo-1.jpg",
    });
    expect(result.accepted).toBe(false);
    expect(result.validation).toEqual({ accepted: false, reason: "borrada" });
  });
});
