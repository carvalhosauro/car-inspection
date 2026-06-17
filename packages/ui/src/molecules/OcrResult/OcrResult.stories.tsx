import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { OcrResult } from "./OcrResult.web";

const meta: Meta<typeof OcrResult> = { title: "Molecules/OcrResult", component: OcrResult };
export default meta;
type Story = StoryObj<typeof OcrResult>;

export const Placa: Story = { args: { type: "placa", value: "ABC1D23", validated: true } };
export const Hodometro: Story = { args: { type: "hodometro", value: "45000 km" } };

export const Smoke: Story = {
  args: { type: "placa", value: "ABC1D23" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Placa")).toBeInTheDocument();
  },
};
