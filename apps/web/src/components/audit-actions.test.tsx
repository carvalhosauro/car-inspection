import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/query-client";
import { AuditActions } from "./audit-actions";

const auditMock = vi.fn();
const invalidateQueriesMock = vi.fn();

vi.mock("@/lib/api-browser", () => ({
  browserApi: () => ({ inspections: { audit: auditMock } }),
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: invalidateQueriesMock }),
  };
});

function renderActions(inspectionId = "i1") {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <AuditActions inspectionId={inspectionId} />
    </QueryClientProvider>,
  );
}

describe("AuditActions", () => {
  beforeEach(() => {
    auditMock.mockReset().mockResolvedValue({});
    invalidateQueriesMock.mockReset();
  });

  it("renders Aprovar and Reprovar buttons", () => {
    renderActions();
    expect(screen.getByRole("button", { name: /aprovar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reprovar/i })).toBeInTheDocument();
  });

  it('calls api.inspections.audit with decision "aprovada" when Aprovar is pressed', async () => {
    renderActions();
    await userEvent.click(screen.getByRole("button", { name: /aprovar/i }));
    await waitFor(() => expect(auditMock).toHaveBeenCalledTimes(1));
    expect(auditMock).toHaveBeenCalledWith("i1", { decision: "aprovada", auditNote: undefined });
  });

  it('calls api.inspections.audit with decision "reprovada" when Reprovar is pressed', async () => {
    renderActions();
    await userEvent.click(screen.getByRole("button", { name: /reprovar/i }));
    await waitFor(() => expect(auditMock).toHaveBeenCalledTimes(1));
    expect(auditMock).toHaveBeenCalledWith("i1", { decision: "reprovada", auditNote: undefined });
  });

  it("passes auditNote when text is typed in the Parecer input", async () => {
    renderActions();
    await userEvent.type(screen.getByLabelText(/parecer/i), "tudo certo");
    await userEvent.click(screen.getByRole("button", { name: /aprovar/i }));
    await waitFor(() => expect(auditMock).toHaveBeenCalledTimes(1));
    expect(auditMock).toHaveBeenCalledWith("i1", { decision: "aprovada", auditNote: "tudo certo" });
  });
});
