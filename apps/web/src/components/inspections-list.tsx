"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { InspectionDto } from "@vistoria/contracts";
import { browserApi } from "@/lib/api-browser";
import { formatDate, formatInspectionStatus } from "@/lib/format";
import { InspectionFilters, type FiltersState } from "@/components/inspection-filters";
import { Table, THead, TBody, TR, TH, TD, TableContainer, TableEmpty } from "@/components/ui/table";
import { StatusChip } from "@/components/ui/status-chip";
import { PageHeader } from "@/components/ui/page-header";

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
    <div className="space-y-6">
      <PageHeader
        title="Vistorias"
        description="Acompanhe todas as vistorias e seus respectivos status."
      />
      <div className="rounded-lg border border-border bg-card p-4 shadow-card">
        <InspectionFilters value={filters} onChange={setFilters} />
      </div>
      <TableContainer>
        <Table>
          <THead>
            <TR>
              <TH>Tipo</TH>
              <TH>Status</TH>
              <TH>Veículo</TH>
              <TH>Vistoriador</TH>
              <TH>Criada</TH>
              <TH className="text-right">Ações</TH>
            </TR>
          </THead>
          <TBody>
            {items.length === 0 && (
              <TableEmpty colSpan={6}>Nenhuma vistoria encontrada com os filtros atuais.</TableEmpty>
            )}
            {items.map((i) => (
              <TR key={i.id}>
                <TD className="capitalize">{i.type}</TD>
                <TD>
                  <StatusChip status={i.status}>{formatInspectionStatus(i.status)}</StatusChip>
                </TD>
                <TD className="font-mono text-xs text-muted-foreground">{i.vehicleId}</TD>
                <TD className="font-mono text-xs text-muted-foreground">{i.inspectorId}</TD>
                <TD className="text-muted-foreground">{formatDate(i.createdAt)}</TD>
                <TD className="text-right">
                  <Link
                    className="text-sm font-medium text-primary hover:underline"
                    href={`/inspections/${i.id}`}
                  >
                    Ver laudo
                  </Link>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </TableContainer>
    </div>
  );
}
