import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Input } from "./Input.web";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  args: { placeholder: "Placa do veículo" }
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const Filled: Story = { args: { value: "ABC1D23", label: "Placa" } };
export const Error: Story = { args: { errorMessage: "Placa inválida" } };
export const Search: Story = { args: { type: "search", placeholder: "Buscar veículo" } };
export const Select: Story = {
  args: { type: "select", options: [{ label: "Carro", value: "car" }, { label: "Moto", value: "moto" }] }
};
export const DatePicker: Story = { args: { type: "datepicker", label: "Data" } };

export const Smoke: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("textbox")).toBeInTheDocument();
  }
};
