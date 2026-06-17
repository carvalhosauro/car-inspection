ALTER TABLE "inspection_evidences" ADD CONSTRAINT "inspection_evidences_item_idempotency_key" UNIQUE("inspection_item_id","idempotency_key");
