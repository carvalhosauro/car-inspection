"use client";

import { useRef, useState, type FormEvent } from "react";
import type { VehicleDto, CreateVehicleInput, VehicleStatus } from "@vistoria/contracts";
import { VEHICLE_STATUSES } from "@vistoria/contracts";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@vistoria/ui/atoms/Button";
import { HtmlInput } from "@/components/ui/html-input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";

export function VehicleFormDialog({
  open,
  onClose,
  initial,
  onSubmit,
  pending,
}: {
  open: boolean;
  onClose: () => void;
  initial?: VehicleDto;
  onSubmit: (input: CreateVehicleInput) => void;
  pending: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [plate, setPlate] = useState(initial?.plate ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [year, setYear] = useState(initial?.year?.toString() ?? "");
  const [color, setColor] = useState(initial?.color ?? "");
  const [currentKm, setCurrentKm] = useState((initial?.currentKm ?? 0).toString());
  const [status, setStatus] = useState<VehicleStatus>(initial?.status ?? "disponivel");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      plate: plate.trim().toUpperCase(),
      model: model.trim(),
      year: year ? Number(year) : undefined,
      color: color || undefined,
      currentKm: Number(currentKm),
      status,
    });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <form ref={formRef} onSubmit={submit} className="space-y-4">
        <h2 className="text-lg font-semibold">{initial ? "Editar veículo" : "Novo veículo"}</h2>
        <div className="space-y-2">
          <Label htmlFor="plate">Placa</Label>
          <HtmlInput id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <HtmlInput id="model" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="year">Ano</Label>
            <HtmlInput id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Cor</Label>
            <HtmlInput id="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="km">Km atual</Label>
            <HtmlInput id="km" type="number" value={currentKm} onChange={(e) => setCurrentKm(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Situação</Label>
            <NativeSelect
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as VehicleStatus)}
            >
              {VEHICLE_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </NativeSelect>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button label="Cancelar" variant="secondary" onPress={onClose} />
          <Button
            label="Salvar"
            disabled={pending}
            onPress={() => formRef.current?.requestSubmit()}
          />
        </div>
      </form>
    </Dialog>
  );
}
