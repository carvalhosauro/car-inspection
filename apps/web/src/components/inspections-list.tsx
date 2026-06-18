"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { InspectionDto } from "@vistoria/contracts";
import { browserApi } from "@/lib/api-browser";
import { formatDate, formatInspectionStatus } from "@/lib/format";
import { InspectionFilters, type FiltersState } from "@/components/inspection-filters";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusChip } from "@/components/ui/status-chip";

export function InspectionsList({ initial }: { initial: InspectionDto[] }) {
  const api = browserApi();
  const [filters, setFilters] = useState<FiltersState>({});

  const { data } = useQuery({
    queryKey: ["inspections", filters],
    queryFn: () => api.inspections.list(filters),
    placeholderData: { items: initial, nextCursor: null },
  });

  const items = data?.items ?? initial;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Vistorias</h1>
      <InspectionFilters value={filters} onChange={setFilters} />
      <Table>
        <THead>
          <TR>
            <TH>Tipo</TH>
            <TH>Status</TH>
            <TH>Veículo</TH>
            <TH>Vistoriador</TH>
            <TH>Criada</TH>
            <TH />
          </TR>
        </THead>
        <TBody>
          {items.map((i) => (
            <TR key={i.id}>
              <TD>{i.type}</TD>
              <TD>
                <StatusChip>{formatInspectionStatus(i.status)}</StatusChip>
              </TD>
              <TD className="font-mono text-xs">{i.vehicleId}</TD>
              <TD className="font-mono text-xs">{i.inspectorId}</TD>
              <TD>{formatDate(i.createdAt)}</TD>
              <TD className="text-right">
                <Link className="text-sm underline" href={`/inspections/${i.id}`}>
                  Ver laudo
                </Link>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
