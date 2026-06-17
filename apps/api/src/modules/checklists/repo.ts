import { and, asc, eq, gt } from "drizzle-orm";
import { schema, newId } from "@vistoria/db";
import type { Tx } from "../../core/auth/types.js";
import type { ProofKind } from "@vistoria/contracts";

export async function insertTemplate(tx: Tx, tenantId: string, name: string) {
  const rows = await tx
    .insert(schema.checklistTemplates)
    .values({ id: newId(), tenantId, name, active: true })
    .returning();
  return rows[0]!;
}

export async function insertItem(
  tx: Tx,
  tenantId: string,
  templateId: string,
  data: { label: string; description?: string; order: number },
) {
  const rows = await tx
    .insert(schema.checklistItems)
    .values({
      id: newId(),
      tenantId,
      templateId,
      order: data.order,
      label: data.label,
      description: data.description ?? null,
    })
    .returning();
  return rows[0]!;
}

export async function insertRequirement(
  tx: Tx,
  tenantId: string,
  checklistItemId: string,
  data: { kind: ProofKind; required: boolean; config?: Record<string, unknown>; order: number },
) {
  const rows = await tx
    .insert(schema.checklistItemRequirements)
    .values({
      id: newId(),
      tenantId,
      checklistItemId,
      kind: data.kind,
      required: data.required,
      config: data.config ?? null,
      order: data.order,
    })
    .returning();
  return rows[0]!;
}

export async function getTemplate(tx: Tx, tenantId: string, id: string) {
  const rows = await tx
    .select()
    .from(schema.checklistTemplates)
    .where(and(eq(schema.checklistTemplates.id, id), eq(schema.checklistTemplates.tenantId, tenantId)))
    .limit(1);
  return rows[0];
}

export async function listItems(tx: Tx, templateId: string) {
  return tx
    .select()
    .from(schema.checklistItems)
    .where(eq(schema.checklistItems.templateId, templateId))
    .orderBy(asc(schema.checklistItems.order));
}

export async function listRequirements(tx: Tx, checklistItemId: string) {
  return tx
    .select()
    .from(schema.checklistItemRequirements)
    .where(eq(schema.checklistItemRequirements.checklistItemId, checklistItemId))
    .orderBy(asc(schema.checklistItemRequirements.order));
}

export async function listTemplates(tx: Tx, cursor: string | undefined, limit: number) {
  const where = cursor
    ? and(eq(schema.checklistTemplates.active, true), gt(schema.checklistTemplates.id, cursor))
    : eq(schema.checklistTemplates.active, true);
  return tx
    .select()
    .from(schema.checklistTemplates)
    .where(where)
    .orderBy(asc(schema.checklistTemplates.id))
    .limit(limit + 1);
}

export async function updateItem(
  tx: Tx,
  tenantId: string,
  id: string,
  data: Partial<{ label: string; description: string; order: number }>,
) {
  const rows = await tx
    .update(schema.checklistItems)
    .set(data)
    .where(and(eq(schema.checklistItems.id, id), eq(schema.checklistItems.tenantId, tenantId)))
    .returning();
  return rows[0];
}

export async function deleteRequirement(tx: Tx, itemId: string, requirementId: string) {
  const rows = await tx
    .delete(schema.checklistItemRequirements)
    .where(
      and(
        eq(schema.checklistItemRequirements.id, requirementId),
        eq(schema.checklistItemRequirements.checklistItemId, itemId),
      ),
    )
    .returning();
  return rows[0];
}
