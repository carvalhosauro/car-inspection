import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Button } from "./Button.web";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  args: { label: "Aprovar" }
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Success: Story = { args: { variant: "success", label: "Aprovar" } };
export const Danger: Story = { args: { variant: "danger", label: "Reprovar" } };
export const Small: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button")).toBeInTheDocument();
  }
};
