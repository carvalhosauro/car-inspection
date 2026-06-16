import { z } from "zod";
import { PROOF_KINDS } from "./proof-registry";

export const requirementDto = z.object({
  id: z.string().uuid(),
  checklistItemId: z.string().uuid(),
  kind: z.enum(PROOF_KINDS),
  required: z.boolean(),
  config: z.record(z.unknown()).nullable(),
  order: z.number().int(),
});
export type RequirementDto = z.infer<typeof requirementDto>;

export const checklistItemDto = z.object({
  id: z.string().uuid(),
  templateId: z.string().uuid(),
  order: z.number().int(),
  label: z.string(),
  description: z.string().nullable(),
  requirements: z.array(requirementDto),
});
export type ChecklistItemDto = z.infer<typeof checklistItemDto>;

export const checklistTemplateDto = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string(),
  active: z.boolean(),
  createdAt: z.string().datetime(),
  items: z.array(checklistItemDto),
});
export type ChecklistTemplateDto = z.infer<typeof checklistTemplateDto>;

export const createRequirementInput = z.object({
  kind: z.enum(PROOF_KINDS),
  required: z.boolean().default(true),
  config: z.record(z.unknown()).optional(),
  order: z.number().int().default(0),
});

export const createChecklistItemInput = z.object({
  label: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().default(0),
  requirements: z.array(createRequirementInput).default([]),
});

export const createChecklistTemplateInput = z.object({
  name: z.string().min(1),
  items: z.array(createChecklistItemInput).default([]),
});
export type CreateChecklistTemplateInput = z.infer<typeof createChecklistTemplateInput>;
