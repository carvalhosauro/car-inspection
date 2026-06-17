import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { ProgressBar } from "./ProgressBar.web";

const meta: Meta<typeof ProgressBar> = { title: "Atoms/ProgressBar", component: ProgressBar };
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Low: Story = { args: { value: 20 } };
export const Mid: Story = { args: { value: 65 } };
export const Complete: Story = { args: { value: 100 } };

export const Smoke: Story = {
  args: { value: 50 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("progressbar")).toBeInTheDocument();
  }
};
