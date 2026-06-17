import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { IconButton } from "./IconButton.web";

const meta: Meta<typeof IconButton> = {
  title: "Atoms/IconButton",
  component: IconButton,
  args: { ariaLabel: "Ação" }
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Camera: Story = { args: { icon: "camera", ariaLabel: "Tirar foto" } };
export const Search: Story = { args: { icon: "search", ariaLabel: "Buscar" } };
export const Plus: Story = { args: { icon: "plus", ariaLabel: "Adicionar" } };
export const Edit: Story = { args: { icon: "edit", ariaLabel: "Editar" } };
export const Trash: Story = { args: { icon: "trash", ariaLabel: "Excluir" } };
export const ArrowRight: Story = { args: { icon: "arrow-right", ariaLabel: "Avançar" } };
export const Ghost: Story = { args: { icon: "edit", ariaLabel: "Editar", ghost: true } };

export const Smoke: Story = {
  args: { icon: "camera", ariaLabel: "Tirar foto" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button")).toBeInTheDocument();
  }
};
