"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vistoria/ui/atoms/Button";
import { Dialog } from "@/components/ui/dialog";
import { TemplateEditor } from "@/components/template-editor";

export function NewTemplateButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button label="Adicionar" onPress={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} className="max-w-2xl">
        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Novo template</h2>
          <p className="text-sm text-muted-foreground">Monte os itens e requisitos de prova do checklist.</p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <TemplateEditor
            onCreated={() => {
              setOpen(false);
              router.refresh();
            }}
          />
        </div>
      </Dialog>
    </>
  );
}
