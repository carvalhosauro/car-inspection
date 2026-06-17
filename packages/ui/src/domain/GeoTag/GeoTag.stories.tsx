import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { GeoTag } from "./GeoTag.web";

const meta: Meta<typeof GeoTag> = {
  title: "Domain/GeoTag",
  component: GeoTag,
  args: { city: "São Paulo", state: "SP" },
};
export default meta;
type Story = StoryObj<typeof GeoTag>;

export const Default: Story = {};
export const Validated: Story = { args: { validated: true } };

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("São Paulo, SP")).toBeInTheDocument();
  },
};
