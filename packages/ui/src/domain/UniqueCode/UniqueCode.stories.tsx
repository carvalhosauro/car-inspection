import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { UniqueCode } from "./UniqueCode.web";

const meta: Meta<typeof UniqueCode> = {
  title: "Domain/UniqueCode",
  component: UniqueCode,
  args: { code: "VST-AB12C9" },
};
export default meta;
type Story = StoryObj<typeof UniqueCode>;

export const Default: Story = {};

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("VST-AB12C9")).toBeInTheDocument();
  },
};
