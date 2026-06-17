import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { UploadArea } from "./UploadArea.web";

const meta: Meta<typeof UploadArea> = { title: "Molecules/UploadArea", component: UploadArea };
export default meta;
type Story = StoryObj<typeof UploadArea>;

export const Idle: Story = { args: { state: "idle" } };
export const Dragging: Story = { args: { state: "dragging" } };
export const Uploading: Story = { args: { state: "uploading" } };
export const Success: Story = { args: { state: "success" } };
export const Error: Story = { args: { state: "error" } };

export const Smoke: Story = {
  args: { state: "idle" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByTestId("upload-area")).toBeInTheDocument();
  },
};
