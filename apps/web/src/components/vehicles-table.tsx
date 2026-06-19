"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInvalidateOnSuccess } from "@/lib/mutation-utils";
import type { VehicleDto, CreateVehicleInput, UserRole } from "@vistoria/contracts";
import { browserApi } from "@/lib/api-browser";
import { can } from "@/lib/rbac";
import { formatDate } from "@/lib/format";
import { Button } from "@vistoria/ui/atoms/Button";
import { StatusChip } from "@/components/ui/status-chip";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { VehicleFormDialog } from "@/components/vehicle-form-dialog";

export function VehiclesTable({
  role,
  initialVehicles,
}: {
  role: UserRole;
  initialVehicles: VehicleDto[];
}) {
  const api = browserApi();
  const qc = useQueryClient();
  const canWrite = can(role, "crudVehicles");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<VehicleDto | null>(null);

  const { data } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => api.base.vehicles.list(),
    initialData: { items: initialVehicles, nextCursor: null },
  });

  const createMut = useMutation({
    mutationFn: (input: CreateVehicleInput) => api.base.vehicles.create(input),
    onSuccess: () => {
      setCreating(false);
      qc.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateVehicleInput }) =>
      api.vehicles.update(id, input),
    onSuccess: () => {
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => api.vehicles.remove(id),
    ...useInvalidateOnSuccess(["vehicles"]),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Frota</h1>
        {canWrite && (
          <Button label="Novo veículo" onPress={() => setCreating(true)} />
        )}
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Placa</TH>
            <TH>Modelo</TH>
            <TH>Km</TH>
            <TH>Situação</TH>
            <TH>Criado</TH>
            <TH />
          </TR>
        </THead>
        <TBody>
          {data.items.map((v) => (
            <TR key={v.id}>
              <TD className="font-mono">{v.plate}</TD>
              <TD>{v.model}</TD>
              <TD>{v.currentKm}</TD>
              <TD>
                <StatusChip>{v.status}</StatusChip>
              </TD>
              <TD>{formatDate(v.createdAt)}</TD>
              <TD className="text-right">
                {canWrite && (
                  <span className="flex justify-end gap-2">
                    <Button
                      label="Editar"
                      variant="secondary"
                      size="sm"
                      onPress={() => setEditing(v)}
                    />
                    <Button
                      label="Excluir"
                      variant="danger"
                      size="sm"
                      onPress={() => removeMut.mutate(v.id)}
                      disabled={removeMut.isPending}
                    />
                  </span>
                )}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      {canWrite && (
        <VehicleFormDialog
          open={creating}
          onClose={() => setCreating(false)}
          onSubmit={(input) => createMut.mutate(input)}
          pending={createMut.isPending}
        />
      )}
      {canWrite && editing && (
        <VehicleFormDialog
          open
          onClose={() => setEditing(null)}
          initial={editing}
          onSubmit={(input) => updateMut.mutate({ id: editing.id, input })}
          pending={updateMut.isPending}
        />
      )}
    </div>
  );
}
