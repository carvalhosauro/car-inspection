import type {
  CreateChecklistTemplateInput,
  ChecklistTemplateDto,
  ChecklistItemDto,
  RequirementDto,
  ProofKind,
  PaginationQuery,
} from "@vistoria/contracts";
import type { Tx } from "../../core/auth/types.js";
import { errors } from "../../core/errors/app-error.js";
import {
  insertTemplate,
  insertItem,
  insertRequirement,
  getTemplate,
  listItems,
  listRequirements,
  listTemplates as listTemplatesRepo,
  updateItem,
  deleteRequirement,
} from "./repo.js";

function reqToDto(row: {
  id: string;
  checklistItemId: string;
  kind: string;
  required: boolean;
  config: unknown;
  order: number;
}): RequirementDto {
  return {
    id: row.id,
    checklistItemId: row.checklistItemId,
    kind: row.kind as ProofKind,
    required: row.required,
    config: (row.config as Record<string, unknown> | null) ?? null,
    order: row.order,
  };
}

async function itemToDto(
  tx: Tx,
  row: { id: string; templateId: string; order: number; label: string; description: string | null },
): Promise<ChecklistItemDto> {
  const reqs = await listRequirements(tx, row.id);
  return {
    id: row.id,
    templateId: row.templateId,
    order: row.order,
    label: row.label,
    description: row.description,
    requirements: reqs.map(reqToDto),
  };
}

async function templateToDto(
  tx: Tx,
  row: { id: string; tenantId: string; name: string; active: boolean; createdAt: Date },
): Promise<ChecklistTemplateDto> {
  const items = await listItems(tx, row.id);
  const itemDtos = await Promise.all(items.map((i) => itemToDto(tx, i)));
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    active: row.active,
    createdAt: row.createdAt.toISOString(),
    items: itemDtos,
  };
}

export async function createTemplate(
  tx: Tx,
  tenantId: string,
  input: CreateChecklistTemplateInput,
): Promise<ChecklistTemplateDto> {
  const template = await insertTemplate(tx, tenantId, input.name);
  for (const item of input.items) {
    const itemRow = await insertItem(tx, tenantId, template.id, {
      label: item.label,
      description: item.description,
      order: item.order,
    });
    for (const req of item.requirements) {
      await insertRequirement(tx, tenantId, itemRow.id, {
        kind: req.kind,
        required: req.required,
        config: req.config,
        order: req.order,
      });
    }
  }
  return templateToDto(tx, template);
}

export async function getTemplateDto(tx: Tx, tenantId: string, id: string): Promise<ChecklistTemplateDto> {
  const row = await getTemplate(tx, tenantId, id);
  if (!row) throw errors.notFound("Template not found");
  return templateToDto(tx, row);
}

export async function listTemplates(
  tx: Tx,
  query: PaginationQuery,
): Promise<{ items: ChecklistTemplateDto[]; nextCursor: string | null }> {
  const rows = await listTemplatesRepo(tx, query.cursor, query.limit);
  const hasMore = rows.length > query.limit;
  const page = hasMore ? rows.slice(0, query.limit) : rows;
  const items = await Promise.all(page.map((row) => templateToDto(tx, row)));
  return { items, nextCursor: hasMore ? page[page.length - 1]!.id : null };
}

export async function addItem(
  tx: Tx,
  tenantId: string,
  templateId: string,
  input: {
    label: string;
    description?: string;
    order: number;
    requirements: CreateChecklistTemplateInput["items"][number]["requirements"];
  },
): Promise<ChecklistItemDto> {
  const template = await getTemplate(tx, tenantId, templateId);
  if (!template) throw errors.notFound("Template not found");
  const itemRow = await insertItem(tx, tenantId, templateId, {
    label: input.label,
    description: input.description,
    order: input.order,
  });
  for (const req of input.requirements) {
    await insertRequirement(tx, tenantId, itemRow.id, {
      kind: req.kind,
      required: req.required,
      config: req.config,
      order: req.order,
    });
  }
  return itemToDto(tx, itemRow);
}

export async function patchItem(
  tx: Tx,
  tenantId: string,
  id: string,
  data: Partial<{ label: string; description: string; order: number }>,
): Promise<ChecklistItemDto> {
  const row = await updateItem(tx, tenantId, id, data);
  if (!row) throw errors.notFound("Item not found");
  return itemToDto(tx, row);
}

export async function addRequirement(
  tx: Tx,
  tenantId: string,
  itemId: string,
  input: { kind: ProofKind; required: boolean; config?: Record<string, unknown>; order: number },
): Promise<RequirementDto> {
  const row = await insertRequirement(tx, tenantId, itemId, input);
  return reqToDto(row);
}

export async function removeRequirement(
  tx: Tx,
  itemId: string,
  requirementId: string,
): Promise<void> {
  const row = await deleteRequirement(tx, itemId, requirementId);
  if (!row) throw errors.notFound("Requirement not found");
}
