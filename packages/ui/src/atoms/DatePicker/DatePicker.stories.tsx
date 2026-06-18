import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { DatePicker } from "./DatePicker.web";

const meta: Meta<typeof DatePicker> = {
  title: "Atoms/DatePicker",
  component: DatePicker,
  args: { label: "Data da vistoria" }
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Empty: Story = { args: { label: "Data da vistoria", placeholder: "DD/MM/AAAA" } };
export const WithValue: Story = { args: { label: "Data", value: "2026-06-18" } };
export const WithError: Story = { args: { label: "Data", errorMessage: "Data obrigatória" } };
export const Disabled: Story = { args: { label: "Data", disabled: true } };

export const Smoke: Story = {
  args: { label: "Data", placeholder: "DD/MM/AAAA" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Data" })).toBeInTheDocument();
  }
};
