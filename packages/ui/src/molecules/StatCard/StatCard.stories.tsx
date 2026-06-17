import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { StatCard } from "./StatCard.web";

const meta: Meta<typeof StatCard> = {
  title: "Molecules/StatCard",
  component: StatCard,
  args: { value: "120", label: "Vistorias hoje" }
};
export default meta;
type Story = StoryObj<typeof StatCard>;

export const Plain: Story = {};
export const Up: Story = { args: { change: "12%", changeDirection: "up" } };
export const Down: Story = { args: { change: "3%", changeDirection: "down" } };

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("120")).toBeInTheDocument();
  }
};
