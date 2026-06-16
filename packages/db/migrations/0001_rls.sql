-- self-FK for the inspection_items tree
ALTER TABLE "inspection_items"
  ADD CONSTRAINT "inspection_items_parent_fk"
  FOREIGN KEY ("parent_item_id") REFERENCES "inspection_items"("id");

-- unique plate per tenant
CREATE UNIQUE INDEX "vehicles_tenant_plate_uq" ON "vehicles" ("tenant_id", "plate");

-- enable RLS on every tenant-owned table
ALTER TABLE "users"                        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vehicles"                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "checklist_templates"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "checklist_items"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "checklist_item_requirements"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inspections"                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inspection_items"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inspection_evidences"         ENABLE ROW LEVEL SECURITY;

-- uniform tenant-isolation policy (superadmin bypasses)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users','vehicles','checklist_templates','checklist_items',
    'checklist_item_requirements','inspections','inspection_items','inspection_evidences'
  ] LOOP
    EXECUTE format($f$
      CREATE POLICY tenant_isolation ON %I
      USING (
        current_setting('app.role', true) = 'superadmin'
        OR tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid
      )
      WITH CHECK (
        current_setting('app.role', true) = 'superadmin'
        OR tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid
      );
    $f$, t);
  END LOOP;
END $$;
