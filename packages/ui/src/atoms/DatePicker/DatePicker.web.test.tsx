import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "./DatePicker.web";

describe("DatePicker (web)", () => {
  it("renders the trigger button with the placeholder", () => {
    render(<DatePicker placeholder="DD/MM/AAAA" label="Data" />);
    expect(screen.getByRole("button", { name: "Data" })).toHaveTextContent("DD/MM/AAAA");
  });

  it("renders the formatted date when value is set", () => {
    render(<DatePicker value="2026-06-18" label="Data" />);
    expect(screen.getByRole("button", { name: "Data" })).toHaveTextContent("18/06/2026");
  });

  it("opens the popover with a calendar when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Data" />);
    await user.click(screen.getByRole("button", { name: "Data" }));
    expect(await screen.findByRole("grid")).toBeInTheDocument();
  });

  it("shows the error message", () => {
    render(<DatePicker label="Data" errorMessage="Data obrigatória" />);
    expect(screen.getByText("Data obrigatória")).toBeInTheDocument();
  });
});
