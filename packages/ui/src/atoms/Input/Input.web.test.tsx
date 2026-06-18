import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input.web";

describe("Input (web)", () => {
  it("renders a text field with placeholder", () => {
    render(<Input placeholder="Placa" />);
    expect(screen.getByPlaceholderText("Placa")).toBeInTheDocument();
  });
  it("renders a label when provided", () => {
    render(<Input label="Placa" value="ABC1D23" />);
    expect(screen.getByText("Placa")).toBeInTheDocument();
  });
  it("emits onChangeText on typing", async () => {
    const onChangeText = vi.fn();
    render(<Input onChangeText={onChangeText} />);
    await userEvent.type(screen.getByRole("textbox"), "A");
    expect(onChangeText).toHaveBeenCalledWith("A");
  });
  it("shows the error message and marks state error", () => {
    render(<Input errorMessage="Campo obrigatório" />);
    const field = screen.getByRole("textbox");
    expect(field).toHaveAttribute("data-state", "error");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
  });
  it("renders a select with options", () => {
    render(<Input type="select" options={[{ label: "Carro", value: "car" }]} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Carro" })).toBeInTheDocument();
  });
  it("uses search input type for search", () => {
    render(<Input type="search" placeholder="Buscar" />);
    expect(screen.getByPlaceholderText("Buscar")).toHaveAttribute("type", "search");
  });
});
