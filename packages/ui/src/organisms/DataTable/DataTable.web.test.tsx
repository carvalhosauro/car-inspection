import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable.web";
import type { Column } from "./DataTable.logic";

type Row = { plate: string; status: "concluido" | "pendente" };

const columns: Column<Row>[] = [
  { key: "plate", header: "Placa", type: "text" },
  { key: "status", header: "Status", type: "status" },
  { key: "status", header: "Ações", type: "actions" },
];

const rows: Row[] = [
  { plate: "ABC1D23", status: "concluido" },
  { plate: "XYZ9K88", status: "pendente" },
];

describe("DataTable (web)", () => {
  it("renders headers and text cells", () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByRole("columnheader", { name: "Placa" })).toBeInTheDocument();
    expect(screen.getByText("ABC1D23")).toBeInTheDocument();
    expect(screen.getByText("XYZ9K88")).toBeInTheDocument();
  });

  it("renders one row per data item using the table role structure", () => {
    render(<DataTable columns={columns} rows={rows} />);
    // 1 header row + 2 body rows
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("renders a Badge in status cells", () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByText("Concluído")).toBeInTheDocument();
    expect(screen.getByText("Pendente")).toBeInTheDocument();
  });

  it("fires onView and onEdit from action icons", async () => {
    const onView = vi.fn();
    const onEdit = vi.fn();
    render(<DataTable columns={columns} rows={rows} onView={onView} onEdit={onEdit} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Visualizar" })[0]!);
    await userEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]!);
    expect(onView).toHaveBeenCalledWith(rows[0]);
    expect(onEdit).toHaveBeenCalledWith(rows[0]);
  });

  it("disables prev on the first page and enables next", () => {
    render(<DataTable columns={columns} rows={rows} page={1} totalPages={3} />);
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próximo" })).toBeEnabled();
  });

  it("disables next on the last page and enables prev", () => {
    render(<DataTable columns={columns} rows={rows} page={3} totalPages={3} />);
    expect(screen.getByRole("button", { name: "Anterior" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Próximo" })).toBeDisabled();
  });

  it("shows the current page indicator", () => {
    render(<DataTable columns={columns} rows={rows} page={2} totalPages={3} />);
    expect(screen.getByText(/2.*de.*3/)).toBeInTheDocument();
  });

  it("calls onPrev and onNext when controls are clicked", async () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(
      <DataTable columns={columns} rows={rows} page={2} totalPages={3} onPrev={onPrev} onNext={onNext} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Anterior" }));
    await userEvent.click(screen.getByRole("button", { name: "Próximo" }));
    expect(onPrev).toHaveBeenCalledOnce();
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("defaults to a single page when pagination props are omitted", () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próximo" })).toBeDisabled();
  });

  it("shows empty message when rows is empty", () => {
    render(<DataTable columns={columns} rows={[]} />);
    expect(screen.getByText("Nenhum registro encontrado")).toBeInTheDocument();
  });

  it("accepts custom emptyMessage", () => {
    render(<DataTable columns={columns} rows={[]} emptyMessage="Sem vistorias" />);
    expect(screen.getByText("Sem vistorias")).toBeInTheDocument();
  });

  it("shows loading skeleton and aria-busy when loading", () => {
    render(<DataTable columns={columns} rows={[]} loading />);
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
  });
});
