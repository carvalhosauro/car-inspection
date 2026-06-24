"use client";

import { useRef, useState, type FormEvent } from "react";
import type {
  CreateInspectionInput,
  InspectionType,
  VehicleDto,
  ChecklistTemplateDto,
  UserDto,
} from "@vistoria/contracts";
import { INSPECTION_TYPES } from "@vistoria/contracts";
import { Button } from "@vistoria/ui/atoms/Button";
import { formatInspectionType } from "@/lib/format";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";
import { HtmlInput } from "@/components/ui/html-input";

export function InspectionFormDialog({
  open,
  onClose,
  onSubmit,
  pending,
  error,
  vehicles,
  templates,
  inspectors,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateInspectionInput) => void;
  pending: boolean;
  error?: string | null;
  vehicles: VehicleDto[];
  templates: ChecklistTemplateDto[];
  inspectors: UserDto[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [vehicleId, setVehicleId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [inspectorId, setInspectorId] = useState("");
  const [type, setType] = useState<InspectionType>("retirada");
  const [scheduledFor, setScheduledFor] = useState("");

  const activeTemplates = templates.filter((t) => t.active);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!vehicleId || !templateId || !inspectorId) return;
    onSubmit({
      vehicleId,
      templateId,
      inspectorId,
      type,
      scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : undefined,
    });
  }

  const canSubmit = !!vehicleId && !!templateId && !!inspectorId && !pending;

  return (
    <Dialog open={open} onClose={onClose}>
      <form ref={formRef} onSubmit={submit} className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Nova vistoria</h2>
          <p className="text-sm text-muted-foreground">
            Atribua uma checklist e um vistoriador para um veículo.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="i-vehicle">Veículo</Label>
          <NativeSelect
            id="i-vehicle"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione um veículo
            </option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate} — {v.model}
              </option>
            ))}
          </NativeSelect>
          {vehicles.length === 0 && (
            <p className="text-xs text-amber-600">Nenhum veículo cadastrado. Cadastre um na Frota.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="i-template">Checklist</Label>
          <NativeSelect
            id="i-template"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione uma checklist
            </option>
            {activeTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.items.length} {t.items.length === 1 ? "item" : "itens"})
              </option>
            ))}
          </NativeSelect>
          {activeTemplates.length === 0 && (
            <p className="text-xs text-amber-600">
              Nenhuma checklist ativa. Crie um template em Checklists.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="i-inspector">Vistoriador</Label>
          <NativeSelect
            id="i-inspector"
            value={inspectorId}
            onChange={(e) => setInspectorId(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione um vistoriador
            </option>
            {inspectors.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.email}
              </option>
            ))}
          </NativeSelect>
          {inspectors.length === 0 && (
            <p className="text-xs text-amber-600">
              Nenhum vistoriador ativo. Cadastre um em Usuários.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="i-type">Tipo</Label>
            <NativeSelect
              id="i-type"
              value={type}
              onChange={(e) => setType(e.target.value as InspectionType)}
            >
              {INSPECTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {formatInspectionType(t)}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="i-scheduled">Agendar para (opcional)</Label>
            <HtmlInput
              id="i-scheduled"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button label="Cancelar" variant="secondary" onPress={onClose} />
          <Button
            label={pending ? "Criando..." : "Criar vistoria"}
            disabled={!canSubmit}
            onPress={() => formRef.current?.requestSubmit()}
          />
        </div>
      </form>
    </Dialog>
  );
}
