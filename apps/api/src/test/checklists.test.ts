import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildTestApp, seedTenant, authHeader } from "./helpers";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let gestor: { id: string; tenantId: string | null; role: "gestor" };

beforeAll(async () => {
  app = await buildTestApp();
  gestor = (await seedTenant(["gestor"])).users.gestor as typeof gestor;
});

afterAll(async () => {
  await app.close();
});

async function createTemplate() {
  return app.inject({
    method: "POST",
    url: "/v1/checklist-templates",
    headers: authHeader(gestor),
    payload: {
      name: "Retirada Hatch",
      items: [
        {
          label: "Para-choque dianteiro",
          description: "Foto frontal",
          order: 1,
          requirements: [
            { kind: "photo", required: true, config: { expectedLabels: ["bumper"] }, order: 1 },
            { kind: "ocr_plate", required: true, order: 2 },
          ],
        },
      ],
    },
  });
}

describe("checklists", () => {
  it("creates a template with nested items + requirements", async () => {
    const res = await createTemplate();
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.name).toBe("Retirada Hatch");
    expect(body.items).toHaveLength(1);
    expect(body.items[0].requirements).toHaveLength(2);
    expect(body.items[0].requirements[0].kind).toBe("photo");
  });

  it("gets a template by id with its items", async () => {
    const created = await createTemplate();
    const id = created.json().id;
    const res = await app.inject({
      method: "GET",
      url: `/v1/checklist-templates/${id}`,
      headers: authHeader(gestor),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().items[0].label).toBe("Para-choque dianteiro");
  });

  it("adds an item to an existing template", async () => {
    const created = await createTemplate();
    const id = created.json().id;
    const res = await app.inject({
      method: "POST",
      url: `/v1/checklist-templates/${id}/items`,
      headers: authHeader(gestor),
      payload: { label: "Pneu dianteiro esquerdo", order: 2, requirements: [] },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().label).toBe("Pneu dianteiro esquerdo");
  });

  it("patches an item label", async () => {
    const created = await createTemplate();
    const itemId = created.json().items[0].id;
    const res = await app.inject({
      method: "PATCH",
      url: `/v1/checklist-items/${itemId}`,
      headers: authHeader(gestor),
      payload: { label: "Para-choque (frente)" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().label).toBe("Para-choque (frente)");
  });

  it("adds and deletes a requirement", async () => {
    const created = await createTemplate();
    const itemId = created.json().items[0].id;
    const add = await app.inject({
      method: "POST",
      url: `/v1/checklist-items/${itemId}/requirements`,
      headers: authHeader(gestor),
      payload: { kind: "geo", required: true, order: 3 },
    });
    expect(add.statusCode).toBe(201);
    const rid = add.json().id;
    const del = await app.inject({
      method: "DELETE",
      url: `/v1/checklist-items/${itemId}/requirements/${rid}`,
      headers: authHeader(gestor),
    });
    expect(del.statusCode).toBe(204);
  });
});
