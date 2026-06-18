import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { VehicleCard } from "./VehicleCard.web";

const meta: Meta<typeof VehicleCard> = {
  title: "Molecules/VehicleCard",
  component: VehicleCard,
  args: {
    plate: "ABC1D23",
    model: "Onix 1.0",
    year: 2022,
    km: 45000,
    status: "em-andamento",
    progress: 65,
  },
};
export default meta;
type Story = StoryObj<typeof VehicleCard>;

export const InProgress: Story = {};
export const Completed: Story = { args: { status: "concluido", progress: 100 } };
export const Rejected: Story = { args: { status: "reprovado", progress: 40 } };

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("ABC1D23")).toBeInTheDocument();
  },
};
