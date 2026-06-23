"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateInspectionInput, InspectionDto, UserRole } from "@vistoria/contracts";
import { browserApi } from "@/lib/api-browser";
import { can } from "@/lib/rbac";
import { formatDate, formatInspectionStatus, formatInspectionType } from "@/lib/format";
import { Button } from "@vistoria/ui/atoms/Button";
import { InspectionFilters, type FiltersState } from "@/components/inspection-filters";
import { InspectionFormDialog } from "@/components/inspection-form-dialog";
import { Table, THead, TBody, TR, TH, TD, TableContainer, TableEmpty } from "@/components/ui/table";
import { StatusChip } from "@/components/ui/status-chip";
import { PageHeader } from "@/components/ui/page-header";

export function InspectionsList({ initial, role }: { initial: InspectionDto[]; role: UserRole }) {
  const api = browserApi();
  const qc = useQueryClient();
  const canAssign = can(role, "assignInspections");
  const [filters, setFilters] = useState<FiltersState>({});
  const [creating, setCreating] = useState(false);

  const { data } = useQuery({
    queryKey: ["inspections", filters],
    queryFn: () => api.inspections.list(filters),
    placeholderData: { items: initial, nextCursor: null },
  });

  const vehiclesQ = useQuery({
    queryKey: ["vehicles", "lookup"],
    queryFn: () => api.base.vehicles.list(),
  });
  const inspectorsQ = useQuery({
    queryKey: ["inspectors", "lookup"],
    queryFn: () => api.inspectors.list(),
  });

  const vehicleMap = new Map((vehiclesQ.data?.items ?? []).map((v) => [v.id, v]));
  const inspectorMap = new Map((inspectorsQ.data?.items ?? []).map((u) => [u.id, u]));

  const createMut = useMutation({
    mutationFn: (input: CreateInspectionInput) => api.base.inspections.create(input),
    onSuccess: () => {
      setCreating(false);
      qc.invalidateQueries({ queryKey: ["inspections"] });
    },
  });

  const items = data?.items ?? initial;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vistorias"
        description="Acompanhe todas as vistorias e seus respectivos status."
        actions={
          canAssign && (
            <Button
              label="Nova vistoria"
              onPress={() => {
                createMut.reset();
                setCreating(true);
              }}
            />
          )
        }
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
            {items.map((i) => {
              const vehicle = vehicleMap.get(i.vehicleId);
              const inspector = inspectorMap.get(i.inspectorId);
              return (
              <TR key={i.id}>
                <TD>{formatInspectionType(i.type)}</TD>
                <TD>
                  <StatusChip status={i.status}>{formatInspectionStatus(i.status)}</StatusChip>
                </TD>
                <TD>
                  {vehicle ? (
                    <span>
                      <span className="font-mono font-medium">{vehicle.plate}</span>
                      <span className="text-muted-foreground"> · {vehicle.model}</span>
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-muted-foreground">{i.vehicleId}</span>
                  )}
                </TD>
                <TD>
                  {inspector ? (
                    inspector.name
                  ) : (
                    <span className="font-mono text-xs text-muted-foreground">{i.inspectorId}</span>
                  )}
                </TD>
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
              );
            })}
          </TBody>
        </Table>
      </TableContainer>

      {canAssign && (
        <InspectionFormDialog
          open={creating}
          onClose={() => setCreating(false)}
          onSubmit={(input) => createMut.mutate(input)}
          pending={createMut.isPending}
          error={createMut.isError ? "Não foi possível criar a vistoria. Tente novamente." : null}
        />
      )}
    </div>
  );
}
