"use client";

import { useQuery } from "@tanstack/react-query";
import type { InspectionDto, UserRole } from "@vistoria/contracts";
import { browserApi } from "@/lib/api-browser";
import { can } from "@/lib/rbac";
import { formatDate, formatInspectionStatus } from "@/lib/format";
import { AuditActions } from "@/components/audit-actions";
import { Table, THead, TBody, TR, TH, TD, TableContainer, TableEmpty } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusChip } from "@/components/ui/status-chip";
import { PageHeader } from "@/components/ui/page-header";

export function AuditQueue({ role, initial }: { role: UserRole; initial: InspectionDto[] }) {
  const api = browserApi();
  const canAudit = can(role, "auditInspections");

  const { data } = useQuery({
    queryKey: ["audit-queue"],
    // The queue is "concluida" inspections awaiting a verdict.
    queryFn: () => api.inspections.list({ status: "concluida" }),
    initialData: { items: initial, nextCursor: null },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoria"
        description="Vistorias concluídas aguardando parecer de aprovação ou reprovação."
      />
      {!canAudit && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Você não tem permissão para auditar.
        </p>
      )}
      <TableContainer>
        <Table>
          <THead>
            <TR>
              <TH>Tipo</TH>
              <TH>Status</TH>
              <TH>Resultado</TH>
              <TH>Concluída</TH>
              <TH className="text-right">Ações</TH>
            </TR>
          </THead>
          <TBody>
            {data.items.length === 0 && (
              <TableEmpty colSpan={5}>Nenhuma vistoria aguardando auditoria.</TableEmpty>
            )}
            {data.items.map((i) => (
              <TR key={i.id}>
                <TD className="capitalize">{i.type}</TD>
                <TD>
                  <Badge status={i.status}>{formatInspectionStatus(i.status)}</Badge>
                </TD>
                <TD>
                  {i.result ? (
                    <StatusChip status={i.result}>{i.result.replace(/_/g, " ")}</StatusChip>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TD>
                <TD className="text-muted-foreground">{formatDate(i.finishedAt)}</TD>
                <TD className="text-right">
                  {canAudit && <AuditActions inspectionId={i.id} />}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </TableContainer>
    </div>
  );
}
