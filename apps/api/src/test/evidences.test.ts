import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";

// Stub Storage + Vision so the test never hits the network.
vi.mock("../core/storage/index", () => ({
  initStorage: vi.fn(async () => {}),
  downloadBytes: vi.fn(async () => Buffer.from([1, 2, 3])),
  signUploadUrl: vi.fn(),
}));
vi.mock("../core/ai/vision", () => ({
  annotatePhoto: vi.fn(async () => ({
    labels: [{ description: "bumper", score: 0.9 }],
    objects: [],
    safeSearch: { adult: "VERY_UNLIKELY", violence: "VERY_UNLIKELY", racy: "UNLIKELY" },
  })),
  annotateText: vi.fn(async () => "ABC1D23"),
}));
vi.mock("../core/ai/phash", async () => {
  const actual = await vi.importActual<typeof import("../core/ai/phash")>("../core/ai/phash");
  return { perceptualHash: vi.fn(async () => "aaaa1234bbbb5678"), hammingDistance: actual.hammingDistance };
});

import { buildTestApp, seedTenant, authHeader } from "./helpers.js";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let gestor: { id: string; tenantId: string | null; role: "gestor" };
let vistoriador: { id: string; tenantId: string | null; role: "vistoriador" };
let itemId: string;
let inspectionId: string;

beforeAll(async () => {
  app = await buildTestApp();
  const seeded = await seedTenant(["gestor", "vistoriador"]);
  gestor = seeded.users.gestor as typeof gestor;
  vistoriador = seeded.users.vistoriador as typeof vistoriador;

  const v = await app.inject({
    method: "POST",
    url: "/v1/vehicles",
    headers: authHeader(gestor),
    payload: { plate: `EVD1D${Date.now() % 100}`, model: "Onix", currentKm: 1000 },
  });
  const t = await app.inject({
    method: "POST",
    url: "/v1/checklist-templates",
    headers: authHeader(gestor),
    payload: {
      name: "T",
      items: [
        {
          label: "Para-choque",
          order: 1,
          requirements: [{ kind: "photo", required: true, config: { expectedLabels: ["bumper"] }, order: 1 }],
        },
      ],
    },
  });
  const insp = await app.inject({
    method: "POST",
    url: "/v1/inspections",
    headers: authHeader(gestor),
    payload: { vehicleId: v.json().id, templateId: t.json().id, inspectorId: vistoriador.id, type: "retirada" },
  });
  inspectionId = insp.json().id;
  const items = await app.inject({
    method: "GET",
    url: `/v1/inspections/${inspectionId}/items`,
    headers: authHeader(vistoriador),
  });
  itemId = items.json()[0].id;
});

afterAll(async () => {
  await app.close();
});

describe("evidences", () => {
  it("registers a photo evidence and accepts it via the registry", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/v1/inspection-items/${itemId}/evidences`,
      headers: authHeader(vistoriador),
      payload: {
        kind: "photo",
        filePath: "photos/p1.jpg",
        idempotencyKey: `k-${Date.now()}`,
      },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().accepted).toBe(true);
    expect(res.json().kind).toBe("photo");
  });

  it("is idempotent: same idempotencyKey returns the same evidence id", async () => {
    const key = `idem-${Date.now()}`;
    const first = await app.inject({
      method: "POST",
      url: `/v1/inspection-items/${itemId}/evidences`,
      headers: authHeader(vistoriador),
      payload: { kind: "photo", filePath: "photos/p2.jpg", idempotencyKey: key },
    });
    const second = await app.inject({
      method: "POST",
      url: `/v1/inspection-items/${itemId}/evidences`,
      headers: authHeader(vistoriador),
      payload: { kind: "photo", filePath: "photos/p2.jpg", idempotencyKey: key },
    });
    expect(second.statusCode).toBe(201);
    expect(second.json().id).toBe(first.json().id);
  });

  it("registers a geo evidence with value (no Vision call)", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/v1/inspection-items/${itemId}/evidences`,
      headers: authHeader(vistoriador),
      payload: {
        kind: "geo",
        value: { lat: -3.1, lng: -60.0 },
        idempotencyKey: `geo-${Date.now()}`,
      },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().accepted).toBe(true);
  });

  it("rejects an unknown kind with 400", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/v1/inspection-items/${itemId}/evidences`,
      headers: authHeader(vistoriador),
      payload: { kind: "not_a_kind", filePath: "p.jpg", idempotencyKey: `x-${Date.now()}` },
    });
    expect(res.statusCode).toBe(400);
  });

  it("sets item status to conforme after accepted evidence", async () => {
    // Tests #1 (photo) and #3 (geo) already posted accepted evidence.
    // Verify the item status was updated to "conforme" by the service.
    const itemsRes = await app.inject({
      method: "GET",
      url: `/v1/inspections/${inspectionId}/items`,
      headers: authHeader(vistoriador),
    });
    expect(itemsRes.statusCode).toBe(200);
    const item = itemsRes.json().find((i: { id: string }) => i.id === itemId);
    expect(item?.status).toBe("conforme");
  });

  it("patches an item status to nao_conforme with justification", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: `/v1/inspection-items/${itemId}`,
      headers: authHeader(vistoriador),
      payload: { status: "nao_conforme", justification: "arranhão no para-choque" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().status).toBe("nao_conforme");
    expect(res.json().justification).toContain("arranhão");
  });

  it("creates a child sub-item (avaria) via self-FK", async () => {
    const res = await app.inject({
      method: "POST",
      url: `/v1/inspection-items/${itemId}/children`,
      headers: authHeader(vistoriador),
      payload: { labelSnapshot: "Avaria: risco lateral", order: 1 },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().parentItemId).toBe(itemId);
  });
});
