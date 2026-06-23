"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuditInput } from "@vistoria/contracts";
import { browserApi } from "@/lib/api-browser";
import { Button } from "@vistoria/ui/atoms/Button";
import { HtmlInput } from "@/components/ui/html-input";

export function AuditActions({ inspectionId }: { inspectionId: string }) {
  const api = browserApi();
  const qc = useQueryClient();
  const [note, setNote] = useState("");

  const mut = useMutation({
    mutationFn: (decision: AuditInput["decision"]) =>
      api.inspections.audit(inspectionId, { decision, auditNote: note || undefined }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["audit-queue"] }),
  });

  return (
    <div className="flex items-center gap-2">
      <HtmlInput
        aria-label="Parecer"
        placeholder="Parecer (opcional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="max-w-xs"
      />
      <Button
        label="Aprovar"
        onPress={() => mut.mutate("aprovada")}
        disabled={mut.isPending}
      />
      <Button
        label="Reprovar"
        variant="danger"
        onPress={() => mut.mutate("reprovada")}
        disabled={mut.isPending}
      />
    </div>
  );
}
