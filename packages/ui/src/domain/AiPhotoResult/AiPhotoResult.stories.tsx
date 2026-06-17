import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { AiPhotoResult } from "./AiPhotoResult.web";

const meta: Meta<typeof AiPhotoResult> = {
  title: "Domain/AiPhotoResult",
  component: AiPhotoResult,
};
export default meta;
type Story = StoryObj<typeof AiPhotoResult>;

export const Aprovada: Story = { args: { verdict: "aprovada" } };
export const Recusada: Story = { args: { verdict: "recusada", reason: "Imagem desfocada — refaça a foto" } };

export const Smoke: Story = {
  args: { verdict: "aprovada" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByTestId("ai-result")).toBeInTheDocument();
  },
};
