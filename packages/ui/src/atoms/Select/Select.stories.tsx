import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Select } from "./Select.web";
import type { SelectOption } from "./Select.logic";

const VEHICLE_OPTIONS: SelectOption[] = [
  { label: "Carro", value: "car" },
  { label: "Moto", value: "moto" },
  { label: "Caminhão", value: "truck" }
];

const meta: Meta<typeof Select> = {
  title: "Atoms/Select",
  component: Select,
  args: { options: VEHICLE_OPTIONS }
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = { args: { options: VEHICLE_OPTIONS, placeholder: "Tipo de veículo" } };
export const WithValue: Story = { args: { options: VEHICLE_OPTIONS, value: "car", label: "Tipo" } };
export const WithError: Story = { args: { options: VEHICLE_OPTIONS, errorMessage: "Selecione um tipo" } };
export const Disabled: Story = { args: { options: VEHICLE_OPTIONS, disabled: true } };

export const Smoke: Story = {
  args: { options: VEHICLE_OPTIONS, placeholder: "Tipo de veículo" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("combobox")).toBeInTheDocument();
  }
};
