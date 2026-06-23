"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserDto, CreateUserInput } from "@vistoria/contracts";
import { browserApi } from "@/lib/api-browser";
import { useInvalidateOnSuccess } from "@/lib/mutation-utils";
import { formatDate } from "@/lib/format";
import { Button } from "@vistoria/ui/atoms/Button";
import { StatusChip } from "@/components/ui/status-chip";
import { Table, THead, TBody, TR, TH, TD, TableContainer, TableEmpty } from "@/components/ui/table";
import { PageHeader } from "@/components/ui/page-header";
import { UserFormDialog } from "@/components/user-form-dialog";

export function UsersTable({ initial }: { initial: UserDto[] }) {
  const api = browserApi();
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.users.list(),
    initialData: { items: initial, nextCursor: null },
  });

  const createMut = useMutation({
    mutationFn: (input: CreateUserInput) => api.users.create(input),
    onSuccess: () => {
      setCreating(false);
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => api.users.remove(id),
    ...useInvalidateOnSuccess(["users"]),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        description="Gerencie as contas de supervisores e vistoriadores da locadora."
        actions={<Button label="Adicionar" onPress={() => setCreating(true)} />}
      />
      <UserFormDialog
        open={creating}
        onClose={() => setCreating(false)}
        onSubmit={(input) => createMut.mutate(input)}
        pending={createMut.isPending}
      />
      <TableContainer>
        <Table>
          <THead>
            <TR>
              <TH>Nome</TH>
              <TH>E-mail</TH>
              <TH>Papel</TH>
              <TH>Ativo</TH>
              <TH>Criado</TH>
              <TH className="text-right">Ações</TH>
            </TR>
          </THead>
          <TBody>
            {data.items.length === 0 && (
              <TableEmpty colSpan={6}>Nenhum usuário cadastrado ainda.</TableEmpty>
            )}
            {data.items.map((u) => (
              <TR key={u.id}>
                <TD className="font-medium">{u.name}</TD>
                <TD className="text-muted-foreground">{u.email}</TD>
                <TD>
                  <StatusChip status={u.role}>{u.role}</StatusChip>
                </TD>
                <TD>
                  <StatusChip tone={u.active ? "success" : "neutral"}>
                    {u.active ? "Ativo" : "Inativo"}
                  </StatusChip>
                </TD>
                <TD className="text-muted-foreground">{formatDate(u.createdAt)}</TD>
                <TD className="text-right">
                  <Button
                    label="Excluir"
                    variant="danger"
                    size="sm"
                    onPress={() => removeMut.mutate(u.id)}
                    disabled={removeMut.isPending}
                  />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </TableContainer>
    </div>
  );
}
