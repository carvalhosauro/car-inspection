import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Modal } from "./Modal.web";

const meta: Meta<typeof Modal> = {
  title: "Molecules/Modal",
  component: Modal,
  args: { open: true, title: "Confirmar aprovação", children: "Esta ação não pode ser desfeita." }
};
export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {};
export const Warning: Story = { args: { variant: "warning", confirmLabel: "Aprovar" } };

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    await expect(within(body).getByRole("dialog")).toBeInTheDocument();
  }
};
