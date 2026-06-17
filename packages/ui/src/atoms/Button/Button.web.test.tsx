import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button.web";

describe("Button (web)", () => {
  it("renders the label", () => {
    render(<Button label="Aprovar" />);
    expect(screen.getByRole("button", { name: "Aprovar" })).toBeInTheDocument();
  });
  it("exposes variant and size via data attributes", () => {
    render(<Button label="x" variant="danger" size="sm" />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-variant", "danger");
    expect(btn).toHaveAttribute("data-size", "sm");
  });
  it("calls onPress when clicked", async () => {
    const onPress = vi.fn();
    render(<Button label="Go" onPress={onPress} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledOnce();
  });
  it("does not call onPress when disabled", async () => {
    const onPress = vi.fn();
    render(<Button label="Go" onPress={onPress} disabled />);
    await userEvent.click(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });
  it("shows a loading indicator and disables when loading", () => {
    render(<Button label="Go" loading />);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });
});
