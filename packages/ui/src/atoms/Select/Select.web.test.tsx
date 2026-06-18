import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select.web";
import type { SelectOption } from "./Select.logic";

const OPTIONS: SelectOption[] = [
  { label: "Carro", value: "car" },
  { label: "Moto", value: "moto" }
];

describe("Select (web)", () => {
  it("renders the trigger with the placeholder", () => {
    render(<Select options={OPTIONS} placeholder="Tipo de veículo" />);
    expect(screen.getByText("Tipo de veículo")).toBeInTheDocument();
  });

  it("renders the selected value when value prop is set", () => {
    render(<Select options={OPTIONS} value="moto" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Moto");
  });

  it("calls onValueChange when an item is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select options={OPTIONS} onValueChange={onValueChange} placeholder="Tipo" />);
    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Carro" }));
    expect(onValueChange).toHaveBeenCalledWith("car");
  });

  it("shows the error message", () => {
    render(<Select options={OPTIONS} errorMessage="Selecione um tipo" />);
    expect(screen.getByText("Selecione um tipo")).toBeInTheDocument();
  });
});
