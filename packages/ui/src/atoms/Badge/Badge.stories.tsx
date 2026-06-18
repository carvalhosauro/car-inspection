import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Badge } from "./Badge.web";

const meta: Meta<typeof Badge> = { title: "Atoms/Badge", component: Badge };
export default meta;
type Story = StoryObj<typeof Badge>;

export const Concluido: Story = { args: { variant: "concluido" } };
export const EmAndamento: Story = { args: { variant: "em-andamento" } };
export const Pendente: Story = { args: { variant: "pendente" } };
export const Reprovado: Story = { args: { variant: "reprovado" } };
export const Agendado: Story = { args: { variant: "agendado" } };

export const Smoke: Story = {
  args: { variant: "concluido" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Concluído")).toBeInTheDocument();
  },
};
