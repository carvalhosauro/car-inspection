import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { DataTable } from "./DataTable.web";
import type { Column } from "./DataTable.logic";

type Row = Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "plate", header: "Placa", type: "text" },
  { key: "model", header: "Modelo", type: "text" },
  { key: "status", header: "Status", type: "status" },
  { key: "status", header: "Ações", type: "actions" },
];

const rows: Row[] = [
  { plate: "ABC1D23", model: "Onix", status: "concluido" },
  { plate: "XYZ9K88", model: "HB20", status: "pendente" },
  { plate: "QWE4R55", model: "Kwid", status: "reprovado" },
];

const meta: Meta<typeof DataTable<Row>> = {
  title: "Organisms/DataTable",
  component: DataTable,
  args: { columns, rows, page: 1, totalPages: 1 },
};
export default meta;
type Story = StoryObj<typeof DataTable<Row>>;

export const Default: Story = {};
export const Paginated: Story = { args: { page: 2, totalPages: 3 } };

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Placa")).toBeInTheDocument();
  },
};
