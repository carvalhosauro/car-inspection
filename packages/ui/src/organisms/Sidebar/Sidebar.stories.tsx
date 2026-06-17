import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Sidebar } from "./Sidebar.web";

const meta: Meta<typeof Sidebar> = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  args: { activeId: "dashboard" },
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Expanded: Story = {};
export const ActiveFrota: Story = { args: { activeId: "frota" } };
export const Collapsed: Story = { args: { collapsed: true } };

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Dashboard")).toBeInTheDocument();
  },
};
