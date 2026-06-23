"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateChecklistTemplateInput, ProofKind } from "@vistoria/contracts";
import { PROOF_KINDS } from "@vistoria/contracts";
import { browserApi } from "@/lib/api-browser";
import { HtmlInput } from "@/components/ui/html-input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";

interface DraftRequirement {
  kind: ProofKind;
  required: boolean;
  config: Record<string, unknown>;
  order: number;
}
interface DraftItem {
  label: string;
  description?: string;
  order: number;
  requirements: DraftRequirement[];
}

export function TemplateEditor() {
  const api = browserApi();
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);

  // current item-in-progress
  const [itemLabel, setItemLabel] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [pendingReqs, setPendingReqs] = useState<DraftRequirement[]>([]);
  const [reqKind, setReqKind] = useState<ProofKind>("photo");
  const [reqRequired, setReqRequired] = useState(true);
  const [reqLabels, setReqLabels] = useState(""); // comma-separated expectedLabels for photo config

  const createMut = useMutation({
    mutationFn: (input: CreateChecklistTemplateInput) => api.base.templates.create(input),
    onSuccess: () => {
      setName("");
      setItems([]);
      qc.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  function addRequirement() {
    const config: Record<string, unknown> =
      reqKind === "photo" && reqLabels.trim()
        ? { expectedLabels: reqLabels.split(",").map((s) => s.trim()).filter(Boolean) }
        : {};
    setPendingReqs((prev) => [
      ...prev,
      { kind: reqKind, required: reqRequired, config, order: prev.length },
    ]);
    setReqLabels("");
  }

  function addItem() {
    if (!itemLabel.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        label: itemLabel.trim(),
        description: itemDescription.trim() || undefined,
        order: prev.length,
        requirements: pendingReqs,
      },
    ]);
    setItemLabel("");
    setItemDescription("");
    setPendingReqs([]);
  }

  function save() {
    const input: CreateChecklistTemplateInput = { name: name.trim(), items };
    createMut.mutate(input);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tpl-name">Nome do template</Label>
        <HtmlInput id="tpl-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 font-semibold">Novo item</h3>
        <div className="space-y-2">
          <Label htmlFor="item-label">Rótulo do item</Label>
          <HtmlInput id="item-label" value={itemLabel} onChange={(e) => setItemLabel(e.target.value)} />
        </div>
        <div className="mt-2 space-y-2">
          <Label htmlFor="item-desc">Descrição</Label>
          <HtmlInput id="item-desc" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="req-kind">Tipo de prova</Label>
            <NativeSelect id="req-kind" value={reqKind} onChange={(e) => setReqKind(e.target.value as ProofKind)}>
              {PROOF_KINDS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="req-labels">Labels esperados (photo)</Label>
            <HtmlInput
              id="req-labels"
              placeholder="bumper, car"
              value={reqLabels}
              onChange={(e) => setReqLabels(e.target.value)}
              disabled={reqKind !== "photo"}
            />
          </div>
        </div>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={reqRequired} onChange={(e) => setReqRequired(e.target.checked)} />
          Obrigatório
        </label>
        <button
          type="button"
          className="mt-3 rounded-md border border-border px-3 py-1 text-sm hover:bg-muted"
          onClick={addRequirement}
        >
          Adicionar requisito
        </button>

        {pendingReqs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {pendingReqs.map((r, i) => (
              <span key={i} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                {r.kind}{r.required ? " *" : ""}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          onClick={addItem}
        >
          Adicionar item
        </button>
      </div>

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="rounded-md border border-border p-3">
              <p className="font-medium">{it.label}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {it.requirements.map((r, j) => (
                  <span key={j} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                    {r.kind}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        onClick={save}
        disabled={createMut.isPending || !name.trim() || items.length === 0}
      >
        {createMut.isPending ? "Salvando..." : "Salvar template"}
      </button>
    </div>
  );
}
