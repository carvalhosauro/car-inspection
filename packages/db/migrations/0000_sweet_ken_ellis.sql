CREATE TYPE "public"."inspection_result" AS ENUM('conforme', 'com_pendencias');--> statement-breakpoint
CREATE TYPE "public"."inspection_status" AS ENUM('atribuida', 'em_andamento', 'concluida', 'aprovada', 'reprovada');--> statement-breakpoint
CREATE TYPE "public"."inspection_type" AS ENUM('retirada', 'devolucao', 'periodica');--> statement-breakpoint
CREATE TYPE "public"."item_status" AS ENUM('pendente', 'conforme', 'nao_conforme');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('superadmin', 'gestor', 'supervisor', 'vistoriador');--> statement-breakpoint
CREATE TYPE "public"."vehicle_status" AS ENUM('disponivel', 'locado', 'manutencao');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "checklist_item_requirements" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"checklist_item_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"config" jsonb,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "checklist_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"label" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "checklist_templates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inspection_evidences" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"inspection_item_id" uuid NOT NULL,
	"requirement_id" uuid,
	"kind" text NOT NULL,
	"file_path" text,
	"value" jsonb,
	"validation" jsonb,
	"accepted" boolean,
	"idempotency_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inspection_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"inspection_id" uuid NOT NULL,
	"checklist_item_id" uuid,
	"parent_item_id" uuid,
	"order" integer DEFAULT 0 NOT NULL,
	"label_snapshot" text NOT NULL,
	"requirements_snapshot" jsonb NOT NULL,
	"status" "item_status" DEFAULT 'pendente' NOT NULL,
	"justification" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inspections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"inspector_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"type" "inspection_type" NOT NULL,
	"status" "inspection_status" DEFAULT 'atribuida' NOT NULL,
	"result" "inspection_result",
	"scheduled_for" timestamp with time zone,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"geo_lat" numeric,
	"geo_lng" numeric,
	"unique_code" text,
	"audited_by" uuid,
	"audit_note" text,
	"audited_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inspections_unique_code_unique" UNIQUE("unique_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenants" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plate" text NOT NULL,
	"model" text NOT NULL,
	"year" integer,
	"color" text,
	"current_km" integer DEFAULT 0 NOT NULL,
	"status" "vehicle_status" DEFAULT 'disponivel' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checklist_item_requirements" ADD CONSTRAINT "checklist_item_requirements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checklist_item_requirements" ADD CONSTRAINT "checklist_item_requirements_checklist_item_id_checklist_items_id_fk" FOREIGN KEY ("checklist_item_id") REFERENCES "public"."checklist_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_template_id_checklist_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."checklist_templates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checklist_templates" ADD CONSTRAINT "checklist_templates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection_evidences" ADD CONSTRAINT "inspection_evidences_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection_evidences" ADD CONSTRAINT "inspection_evidences_inspection_item_id_inspection_items_id_fk" FOREIGN KEY ("inspection_item_id") REFERENCES "public"."inspection_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection_evidences" ADD CONSTRAINT "inspection_evidences_requirement_id_checklist_item_requirements_id_fk" FOREIGN KEY ("requirement_id") REFERENCES "public"."checklist_item_requirements"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection_items" ADD CONSTRAINT "inspection_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection_items" ADD CONSTRAINT "inspection_items_inspection_id_inspections_id_fk" FOREIGN KEY ("inspection_id") REFERENCES "public"."inspections"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection_items" ADD CONSTRAINT "inspection_items_checklist_item_id_checklist_items_id_fk" FOREIGN KEY ("checklist_item_id") REFERENCES "public"."checklist_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspections" ADD CONSTRAINT "inspections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspections" ADD CONSTRAINT "inspections_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspections" ADD CONSTRAINT "inspections_inspector_id_users_id_fk" FOREIGN KEY ("inspector_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspections" ADD CONSTRAINT "inspections_template_id_checklist_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."checklist_templates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspections" ADD CONSTRAINT "inspections_audited_by_users_id_fk" FOREIGN KEY ("audited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
