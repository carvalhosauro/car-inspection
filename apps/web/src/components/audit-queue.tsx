"use client";

import { useQuery } from "@tanstack/react-query";
import type { InspectionDto, UserRole } from "@vistoria/contracts";
import { browserApi } from "@/lib/api-browser";
import { can } from "@/lib/rbac";
import { formatDate, formatInspectionStatus } from "@/lib/format";
import { AuditActions } from "@/components/audit-actions";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Auditoria</h1>
      {!canAudit && <p className="text-muted-foreground">Você não tem permissão para auditar.</p>}
      <Table>
        <THead>
          <TR>
            <TH>Tipo</TH>
            <TH>Status</TH>
            <TH>Resultado</TH>
            <TH>Concluída</TH>
            <TH />
          </TR>
        </THead>
        <TBody>
          {data.items.map((i) => (
            <TR key={i.id}>
              <TD>{i.type}</TD>
              <TD>
                <Badge>{formatInspectionStatus(i.status)}</Badge>
              </TD>
              <TD>{i.result ?? "—"}</TD>
              <TD>{formatDate(i.finishedAt)}</TD>
              <TD className="text-right">
                {canAudit && <AuditActions inspectionId={i.id} />}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
