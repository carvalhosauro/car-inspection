import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/query-client";
import type { InspectionDto } from "@vistoria/contracts";
import { InspectionsList } from "./inspections-list";

const listMock = vi.fn();
vi.mock("@/lib/api-browser", () => ({
  browserApi: () => ({ inspections: { list: listMock } }),
}));

const INSPECTION: InspectionDto = {
  id: "i1",
  tenantId: "t1",
  vehicleId: "v1",
  inspectorId: "u1",
  templateId: "tpl1",
  type: "retirada",
  status: "atribuida",
  result: null,
  scheduledFor: null,
  startedAt: null,
  finishedAt: null,
  geoLat: null,
  geoLng: null,
  uniqueCode: null,
  createdAt: "2026-06-10T10:00:00.000Z",
};

function renderList() {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <InspectionsList initial={[INSPECTION]} role="gestor" />
    </QueryClientProvider>,
  );
}

describe("InspectionsList", () => {
  beforeEach(() => listMock.mockReset().mockResolvedValue({ items: [INSPECTION], nextCursor: null }));

  it("requeries with the chosen status filter", async () => {
    renderList();
    await userEvent.selectOptions(screen.getByLabelText(/status/i), "concluida");
    await waitFor(() => expect(listMock).toHaveBeenCalled());
    const lastCall = listMock.mock.calls.at(-1)![0];
    expect(lastCall).toMatchObject({ status: "concluida" });
  });
});
