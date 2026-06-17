import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "./IconButton.web";

describe("IconButton (web)", () => {
  it("uses ariaLabel as accessible name", () => {
    render(<IconButton icon="camera" ariaLabel="Tirar foto" />);
    expect(screen.getByRole("button", { name: "Tirar foto" })).toBeInTheDocument();
  });
  it("marks ghost via data attribute", () => {
    render(<IconButton icon="edit" ariaLabel="Editar" ghost />);
    expect(screen.getByRole("button")).toHaveAttribute("data-ghost", "true");
  });
  it("calls onPress on click", async () => {
    const onPress = vi.fn();
    render(<IconButton icon="plus" ariaLabel="Adicionar" onPress={onPress} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledOnce();
  });
});
