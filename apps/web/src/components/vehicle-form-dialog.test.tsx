import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { VehicleDto } from "@vistoria/contracts";
import { VehicleFormDialog } from "./vehicle-form-dialog";

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

function renderDialog({
  initial,
  onSubmit = vi.fn(),
  onClose = vi.fn(),
  pending = false,
}: {
  initial?: VehicleDto;
  onSubmit?: ReturnType<typeof vi.fn>;
  onClose?: ReturnType<typeof vi.fn>;
  pending?: boolean;
} = {}) {
  return render(
    <VehicleFormDialog
      open={true}
      onClose={onClose}
      initial={initial}
      onSubmit={onSubmit}
      pending={pending}
    />,
  );
}

describe("VehicleFormDialog", () => {
  it('renders "Novo veículo" title when no initial prop', () => {
    renderDialog();
    expect(screen.getByText("Novo veículo")).toBeInTheDocument();
  });

  it('renders "Editar veículo" title when initial prop is provided', () => {
    renderDialog({ initial: VEHICLE });
    expect(screen.getByText("Editar veículo")).toBeInTheDocument();
  });

  it("uppercases and trims plate before calling onSubmit", async () => {
    const onSubmit = vi.fn();
    renderDialog({ onSubmit });

    await userEvent.type(screen.getByLabelText(/placa/i), "  abc1d23  ");
    await userEvent.type(screen.getByLabelText(/modelo/i), "Onix");
    await userEvent.click(screen.getByRole("button", { name: /^salvar$/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ plate: "ABC1D23" }),
    );
  });

  it("calls onClose when Cancelar is pressed", async () => {
    const onClose = vi.fn();
    renderDialog({ onClose });

    await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
