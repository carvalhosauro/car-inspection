import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/query-client";
import type { InspectionDto } from "@vistoria/contracts";
import { AuditQueue } from "./audit-queue";

const auditMock = vi.fn();
vi.mock("@/lib/api-browser", () => ({
  browserApi: () => ({ inspections: { audit: auditMock } }),
}));

const PENDING: InspectionDto = {
  id: "i1",
  tenantId: "t1",
  vehicleId: "v1",
  inspectorId: "u1",
  templateId: "tpl1",
  type: "devolucao",
  status: "concluida",
  result: "com_pendencias",
  scheduledFor: null,
  startedAt: null,
  finishedAt: "2026-06-10T11:00:00.000Z",
  geoLat: null,
  geoLng: null,
  uniqueCode: "VST-demo-zzz",
  createdAt: "2026-06-10T09:00:00.000Z",
};

function renderQueue(role: "gestor" | "superadmin") {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <AuditQueue role={role} initial={[PENDING]} />
    </QueryClientProvider>,
  );
}

describe("AuditQueue", () => {
  beforeEach(() => auditMock.mockReset().mockResolvedValue({ ...PENDING, status: "aprovada" }));

  it("approves an inspection via PATCH audit", async () => {
    renderQueue("gestor");
    await userEvent.click(screen.getByRole("button", { name: /aprovar/i }));
    await waitFor(() => expect(auditMock).toHaveBeenCalledTimes(1));
    expect(auditMock.mock.calls[0]).toEqual(["i1", { decision: "aprovada", auditNote: undefined }]);
  });

  it("hides audit actions for a role without auditInspections", () => {
    renderQueue("superadmin");
    expect(screen.queryByRole("button", { name: /aprovar/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /reprovar/i })).toBeNull();
  });
});
