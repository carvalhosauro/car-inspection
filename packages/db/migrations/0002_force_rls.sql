-- Force RLS on table owners so the app connection role cannot bypass tenant policies
ALTER TABLE "users"                        FORCE ROW LEVEL SECURITY;
ALTER TABLE "vehicles"                     FORCE ROW LEVEL SECURITY;
ALTER TABLE "checklist_templates"          FORCE ROW LEVEL SECURITY;
ALTER TABLE "checklist_items"              FORCE ROW LEVEL SECURITY;
ALTER TABLE "checklist_item_requirements"  FORCE ROW LEVEL SECURITY;
ALTER TABLE "inspections"                  FORCE ROW LEVEL SECURITY;
ALTER TABLE "inspection_items"             FORCE ROW LEVEL SECURITY;
ALTER TABLE "inspection_evidences"         FORCE ROW LEVEL SECURITY;
