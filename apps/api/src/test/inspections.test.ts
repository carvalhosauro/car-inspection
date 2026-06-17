import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildTestApp, seedTenant, authHeader } from "./helpers";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let gestor: { id: string; tenantId: string | null; role: "gestor" };
let vistoriador: { id: string; tenantId: string | null; role: "vistoriador" };
let vehicleId: string;
let templateId: string;

beforeAll(async () => {
  app = await buildTestApp();
  const seeded = await seedTenant(["gestor", "vistoriador"]);
  gestor = seeded.users.gestor as typeof gestor;
  vistoriador = seeded.users.vistoriador as typeof vistoriador;

  const v = await app.inject({
    method: "POST",
    url: "/v1/vehicles",
    headers: authHeader(gestor),
    payload: { plate: `INS1S${Date.now() % 100}`, model: "Onix", currentKm: 1000 },
  });
  vehicleId = v.json().id;

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
  templateId = t.json().id;
});

afterAll(async () => {
  await app.close();
});

async function createInspection() {
  return app.inject({
    method: "POST",
    url: "/v1/inspections",
    headers: authHeader(gestor),
    payload: { vehicleId, templateId, inspectorId: vistoriador.id, type: "retirada" },
  });
}

describe("inspections", () => {
  it("creates an inspection and snapshots template items", async () => {
    const res = await createInspection();
    expect(res.statusCode).toBe(201);
    expect(res.json().status).toBe("atribuida");

    const items = await app.inject({
      method: "GET",
      url: `/v1/inspections/${res.json().id}/items`,
      headers: authHeader(vistoriador),
    });
    expect(items.statusCode).toBe(200);
    expect(items.json()).toHaveLength(1);
    expect(items.json()[0].labelSnapshot).toBe("Para-choque");
    expect(items.json()[0].requirementsSnapshot[0].kind).toBe("photo");
  });

  it("snapshot is immutable after template edit", async () => {
    const created = await createInspection();
    const inspectionId = created.json().id;

    const itemsBefore = await app.inject({
      method: "GET",
      url: `/v1/inspections/${inspectionId}/items`,
      headers: authHeader(vistoriador),
    });
    const originalLabel = itemsBefore.json()[0].labelSnapshot;

    const templateItems = await app.inject({
      method: "GET",
      url: `/v1/checklist-templates/${templateId}`,
      headers: authHeader(gestor),
    });
    const templateItemId = templateItems.json().items[0].id;
    await app.inject({
      method: "PATCH",
      url: `/v1/checklist-items/${templateItemId}`,
      headers: authHeader(gestor),
      payload: { label: "Para-choque EDITADO" },
    });

    const itemsAfter = await app.inject({
      method: "GET",
      url: `/v1/inspections/${inspectionId}/items`,
      headers: authHeader(vistoriador),
    });
    expect(itemsAfter.json()[0].labelSnapshot).toBe(originalLabel);
  });

  it("starts an inspection (status em_andamento)", async () => {
    const created = await createInspection();
    const res = await app.inject({
      method: "POST",
      url: `/v1/inspections/${created.json().id}/start`,
      headers: authHeader(vistoriador),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().status).toBe("em_andamento");
    expect(res.json().startedAt).not.toBeNull();
  });

  it("finishes an inspection generating uniqueCode + geo", async () => {
    const created = await createInspection();
    const id = created.json().id;
    await app.inject({
      method: "POST",
      url: `/v1/inspections/${id}/start`,
      headers: authHeader(vistoriador),
    });
    const res = await app.inject({
      method: "POST",
      url: `/v1/inspections/${id}/finish`,
      headers: authHeader(vistoriador),
      payload: { geoLat: -3.1, geoLng: -60.0 },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().status).toBe("concluida");
    expect(res.json().uniqueCode).toMatch(/^VST-/);
    expect(res.json().geoLat).toBe(-3.1);
  });

  it("audits an inspection to aprovada", async () => {
    const created = await createInspection();
    const id = created.json().id;
    await app.inject({
      method: "POST",
      url: `/v1/inspections/${id}/start`,
      headers: authHeader(vistoriador),
    });
    await app.inject({
      method: "POST",
      url: `/v1/inspections/${id}/finish`,
      headers: authHeader(vistoriador),
      payload: { geoLat: -3.1, geoLng: -60.0 },
    });
    const res = await app.inject({
      method: "PATCH",
      url: `/v1/inspections/${id}/audit`,
      headers: authHeader(gestor),
      payload: { decision: "aprovada", auditNote: "ok" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().status).toBe("aprovada");
  });

  it("lists inspections with cursor pagination shape", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/inspections?limit=2",
      headers: authHeader(gestor),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty("items");
    expect(res.json()).toHaveProperty("nextCursor");
  });

  it("lists my inspections for today (vistoriador)", async () => {
    await createInspection();
    const res = await app.inject({
      method: "GET",
      url: "/v1/me/inspections?date=today",
      headers: authHeader(vistoriador),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty("items");
  });
});
