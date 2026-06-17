import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { ChecklistItem } from "./ChecklistItem.web";

const meta: Meta<typeof ChecklistItem> = {
  title: "Molecules/ChecklistItem",
  component: ChecklistItem,
  args: { label: "Pneus dianteiros", sublabel: "Verificar desgaste" },
};
export default meta;
type Story = StoryObj<typeof ChecklistItem>;

export const Conforme: Story = { args: { state: "conforme" } };
export const Pendente: Story = { args: { state: "pendente" } };
export const NaoConforme: Story = { args: { state: "nao-conforme" } };

export const Smoke: Story = {
  args: { state: "conforme" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Pneus dianteiros")).toBeInTheDocument();
  },
};
