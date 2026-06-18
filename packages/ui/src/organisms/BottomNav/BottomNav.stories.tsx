import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { BottomNav } from "./BottomNav.web";

const meta: Meta<typeof BottomNav> = {
  title: "Organisms/BottomNav",
  component: BottomNav,
  args: { activeId: "inicio" },
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof BottomNav>;

export const Default: Story = {};
export const WithAlerts: Story = { args: { alertCount: 3 } };
export const ManyAlerts: Story = { args: { alertCount: 42 } };

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("Câmera"),
    ).toBeInTheDocument();
  },
};
