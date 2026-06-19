import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/query-client";
import type { VehicleDto } from "@vistoria/contracts";
import { VehiclesTable } from "./vehicles-table";

const createMock = vi.fn();
const removeMock = vi.fn();
const listMock = vi.fn();
const updateMock = vi.fn();

vi.mock("@/lib/api-browser", () => ({
  browserApi: () => ({
    base: { vehicles: { create: createMock, list: listMock } },
    vehicles: { update: updateMock, remove: removeMock },
  }),
}));

const VEHICLE: VehicleDto = {
  id: "v1",
  tenantId: "t1",
  plate: "ABC1D23",
  model: "Onix",
  year: 2023,
  color: "Prata",
  currentKm: 15000,
  status: "disponivel",
  createdAt: "2026-06-10T10:00:00.000Z",
  updatedAt: "2026-06-10T10:00:00.000Z",
};

function renderTable(role: "gestor" | "superadmin") {
  const client = makeQueryClient();
  return render(
    <QueryClientProvider client={client}>
      <VehiclesTable role={role} initialVehicles={[VEHICLE]} />
    </QueryClientProvider>,
  );
}

describe("VehiclesTable", () => {
  beforeEach(() => {
    createMock.mockReset();
    removeMock.mockReset();
    updateMock.mockReset();
    listMock.mockReset().mockResolvedValue({ items: [VEHICLE], nextCursor: null });
  });

  it("creates a vehicle through the api-client", async () => {
    createMock.mockResolvedValue({ ...VEHICLE, id: "v2", plate: "XYZ9Z99" });
    renderTable("gestor");

    await userEvent.click(screen.getByRole("button", { name: /novo veículo/i }));
    await userEvent.type(screen.getByLabelText(/placa/i), "xyz9z99");
    await userEvent.type(screen.getByLabelText(/modelo/i), "Polo");
    await userEvent.click(screen.getByRole("button", { name: /^salvar$/i }));

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1));
    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({ plate: "XYZ9Z99", model: "Polo" }));
  });

  it("hides write actions for a role without crudVehicles", () => {
    renderTable("superadmin");
    expect(screen.queryByRole("button", { name: /novo veículo/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /excluir/i })).toBeNull();
  });

  it("opens edit dialog and calls update on submit", async () => {
    updateMock.mockResolvedValue({ ...VEHICLE, model: "Polo" });
    renderTable("gestor");

    await userEvent.click(screen.getByRole("button", { name: /editar/i }));
    const modelInput = screen.getByLabelText(/modelo/i);
    await userEvent.clear(modelInput);
    await userEvent.type(modelInput, "Polo");
    await userEvent.click(screen.getByRole("button", { name: /^salvar$/i }));

    await waitFor(() => expect(updateMock).toHaveBeenCalledTimes(1));
    expect(updateMock).toHaveBeenCalledWith(
      "v1",
      expect.objectContaining({ model: "Polo" }),
    );
  });
});
