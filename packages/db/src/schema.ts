import {
  pgTable, pgEnum, uuid, text, integer, boolean, timestamp, numeric, jsonb,
} from "drizzle-orm/pg-core";
import {
  USER_ROLES, VEHICLE_STATUSES, INSPECTION_TYPES, INSPECTION_STATUSES,
  INSPECTION_RESULTS, ITEM_STATUSES,
} from "@vistoria/contracts";
import { newId } from "./id";

export const userRole = pgEnum("user_role", USER_ROLES);
export const vehicleStatus = pgEnum("vehicle_status", VEHICLE_STATUSES);
export const inspectionType = pgEnum("inspection_type", INSPECTION_TYPES);
export const inspectionStatus = pgEnum("inspection_status", INSPECTION_STATUSES);
export const inspectionResult = pgEnum("inspection_result", INSPECTION_RESULTS);
export const itemStatus = pgEnum("item_status", ITEM_STATUSES);

const id = () => uuid("id").primaryKey().$defaultFn(newId);
const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();

export const tenants = pgTable("tenants", {
  id: id(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
});

export const users = pgTable("users", {
  id: id(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
});

export const vehicles = pgTable("vehicles", {
  id: id(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  plate: text("plate").notNull(),
  model: text("model").notNull(),
  year: integer("year"),
  color: text("color"),
  currentKm: integer("current_km").notNull().default(0),
  status: vehicleStatus("status").notNull().default("disponivel"),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const checklistTemplates = pgTable("checklist_templates", {
  id: id(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  name: text("name").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
});

export const checklistItems = pgTable("checklist_items", {
  id: id(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  templateId: uuid("template_id").notNull().references(() => checklistTemplates.id),
  order: integer("order").notNull(),
  label: text("label").notNull(),
  description: text("description"),
});

export const checklistItemRequirements = pgTable("checklist_item_requirements", {
  id: id(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  checklistItemId: uuid("checklist_item_id").notNull().references(() => checklistItems.id),
  kind: text("kind").notNull(),
  required: boolean("required").notNull().default(true),
  config: jsonb("config"),
  order: integer("order").notNull().default(0),
});

export const inspections = pgTable("inspections", {
  id: id(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id),
  inspectorId: uuid("inspector_id").notNull().references(() => users.id),
  templateId: uuid("template_id").notNull().references(() => checklistTemplates.id),
  type: inspectionType("type").notNull(),
  status: inspectionStatus("status").notNull().default("atribuida"),
  result: inspectionResult("result"),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  geoLat: numeric("geo_lat"),
  geoLng: numeric("geo_lng"),
  uniqueCode: text("unique_code").unique(),
  auditedBy: uuid("audited_by").references(() => users.id),
  auditNote: text("audit_note"),
  auditedAt: timestamp("audited_at", { withTimezone: true }),
  createdAt: createdAt(),
});

export const inspectionItems = pgTable("inspection_items", {
  id: id(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  inspectionId: uuid("inspection_id").notNull().references(() => inspections.id),
  checklistItemId: uuid("checklist_item_id").references(() => checklistItems.id),
  parentItemId: uuid("parent_item_id"),
  order: integer("order").notNull().default(0),
  labelSnapshot: text("label_snapshot").notNull(),
  requirementsSnapshot: jsonb("requirements_snapshot").notNull(),
  status: itemStatus("status").notNull().default("pendente"),
  justification: text("justification"),
  createdAt: createdAt(),
});

export const inspectionEvidences = pgTable("inspection_evidences", {
  id: id(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  inspectionItemId: uuid("inspection_item_id").notNull().references(() => inspectionItems.id),
  requirementId: uuid("requirement_id").references(() => checklistItemRequirements.id),
  kind: text("kind").notNull(),
  filePath: text("file_path"),
  value: jsonb("value"),
  validation: jsonb("validation"),
  accepted: boolean("accepted"),
  idempotencyKey: text("idempotency_key"),
  createdAt: createdAt(),
});
