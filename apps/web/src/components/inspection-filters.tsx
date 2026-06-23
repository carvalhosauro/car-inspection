"use client";

import type { InspectionStatus } from "@vistoria/contracts";
import { INSPECTION_STATUSES } from "@vistoria/contracts";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";
import { HtmlInput } from "@/components/ui/html-input";

export interface FiltersState {
  status?: InspectionStatus;
  inspector?: string;
  vehicle?: string;
  from?: string;
  to?: string;
}

export function InspectionFilters({
  value,
  onChange,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label htmlFor="f-status">Status</Label>
        <NativeSelect
          id="f-status"
          value={value.status ?? ""}
          onChange={(e) =>
            onChange({ ...value, status: (e.target.value || undefined) as InspectionStatus | undefined })
          }
        >
          <option value="">Todos</option>
          {INSPECTION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="space-y-1">
        <Label htmlFor="f-inspector">Vistoriador</Label>
        <HtmlInput
          id="f-inspector"
          value={value.inspector ?? ""}
          onChange={(e) => onChange({ ...value, inspector: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="f-vehicle">Veículo</Label>
        <HtmlInput
          id="f-vehicle"
          value={value.vehicle ?? ""}
          onChange={(e) => onChange({ ...value, vehicle: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
