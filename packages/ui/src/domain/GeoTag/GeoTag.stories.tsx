import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { GeoTag } from "./GeoTag.web";

const meta: Meta<typeof GeoTag> = {
  title: "Domain/GeoTag",
  component: GeoTag,
  args: { lat: -23.5505, lng: -46.6333 },
};
export default meta;
type Story = StoryObj<typeof GeoTag>;

export const Default: Story = {};
export const Acquired: Story = { args: { status: "acquired", address: "São Paulo, SP" } };
export const Error: Story = { args: { status: "error" } };

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Aguardando GPS...")).toBeInTheDocument();
  },
};
