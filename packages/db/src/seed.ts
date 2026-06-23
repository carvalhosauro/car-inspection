import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { db, schema } from "./index";
import { newId } from "./id";

async function main() {
  const existing = await db
    .select({ id: schema.tenants.id })
    .from(schema.tenants)
    .where(eq(schema.tenants.slug, "demo"))
    .limit(1);
  if (existing.length > 0) {
    console.log("Seed skipped — demo tenant already exists. Login: gestor@demo.dev / senha123");
    process.exit(0);
  }

  const tenantId = newId();
  await db.insert(schema.tenants).values({
    id: tenantId, name: "Locadora Demo", slug: "demo", active: true,
  });

  const hash = await argon2.hash("senha123");
  const superId = newId();
  await db.insert(schema.users).values([
    { id: superId, tenantId: null, name: "Super Admin", email: "super@vistoria.dev", passwordHash: hash, role: "superadmin" },
    { id: newId(), tenantId, name: "Gestor Demo", email: "gestor@demo.dev", passwordHash: hash, role: "gestor" },
    { id: newId(), tenantId, name: "Vistoriador Demo", email: "vistoriador@demo.dev", passwordHash: hash, role: "vistoriador" },
  ]);

  await db.insert(schema.vehicles).values({
    id: newId(), tenantId, plate: "ABC1D23", model: "Onix", year: 2023,
    color: "Prata", currentKm: 15000, status: "disponivel",
  });

  const templateId = newId();
  await db.insert(schema.checklistTemplates).values({
    id: templateId, tenantId, name: "Vistoria de Retirada", active: true,
  });
  const itemId = newId();
  await db.insert(schema.checklistItems).values({
    id: itemId, tenantId, templateId, order: 1, label: "Para-choque dianteiro",
    description: "Fotografar de frente",
  });
  await db.insert(schema.checklistItemRequirements).values([
    { id: newId(), tenantId, checklistItemId: itemId, kind: "photo", required: true, config: { expectedLabels: ["bumper", "car"] }, order: 1 },
    { id: newId(), tenantId, checklistItemId: itemId, kind: "ocr_plate", required: true, config: {}, order: 2 },
  ]);

  console.log("Seed done. Login: gestor@demo.dev / senha123");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
