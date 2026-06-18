"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserDto, CreateUserInput } from "@vistoria/contracts";
import { browserApi } from "@/lib/api-browser";
import { formatDate } from "@/lib/format";
import { Button } from "@vistoria/ui/atoms/Button";
import { StatusChip } from "@/components/ui/status-chip";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { UserFormDialog } from "@/components/user-form-dialog";

export function UsersTable({ initial }: { initial: UserDto[] }) {
  const api = browserApi();
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.users.list(),
    initialData: { items: initial, nextCursor: null },
  });

  const createMut = useMutation({
    mutationFn: (input: CreateUserInput) => api.users.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => api.users.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Usuários</h1>
      <UserFormDialog onSubmit={(input) => createMut.mutate(input)} pending={createMut.isPending} />
      <Table>
        <THead>
          <TR>
            <TH>Nome</TH>
            <TH>E-mail</TH>
            <TH>Papel</TH>
            <TH>Ativo</TH>
            <TH>Criado</TH>
            <TH />
          </TR>
        </THead>
        <TBody>
          {data.items.map((u) => (
            <TR key={u.id}>
              <TD>{u.name}</TD>
              <TD>{u.email}</TD>
              <TD>
                <StatusChip>{u.role}</StatusChip>
              </TD>
              <TD>{u.active ? "sim" : "não"}</TD>
              <TD>{formatDate(u.createdAt)}</TD>
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
    </div>
  );
}
