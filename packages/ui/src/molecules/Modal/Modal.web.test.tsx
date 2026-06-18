import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal.web";

describe("Modal (web)", () => {
  it("renders nothing when closed", () => {
    render(<Modal open={false} title="Confirmar aprovação" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("renders title and body when open", () => {
    render(<Modal open title="Confirmar aprovação"><p>Tem certeza?</p></Modal>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirmar aprovação")).toBeInTheDocument();
    expect(screen.getByText("Tem certeza?")).toBeInTheDocument();
  });
  it("invokes onConfirm and onCancel", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<Modal open title="t" onConfirm={onConfirm} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onCancel).toHaveBeenCalledOnce();
  });
  it("exposes warning variant via data attribute", () => {
    render(<Modal open title="t" variant="warning" />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-variant", "warning");
  });
  it("calls onClose when overlay is clicked", async () => {
    const onClose = vi.fn();
    render(<Modal open title="Test" onClose={onClose}><p>content</p></Modal>);
    await userEvent.click(screen.getByRole("presentation"));
    expect(onClose).toHaveBeenCalled();
  });
  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    render(<Modal open title="Test" onClose={onClose}><p>content</p></Modal>);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
