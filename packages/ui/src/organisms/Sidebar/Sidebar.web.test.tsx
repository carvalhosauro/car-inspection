import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "./Sidebar.web";

describe("Sidebar (web)", () => {
  it("renders all default links", () => {
    render(<Sidebar activeId="dashboard" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Usuários")).toBeInTheDocument();
  });
  it("marks the active link with aria-current", () => {
    render(<Sidebar activeId="frota" />);
    const active = screen.getByText("Frota").closest("a, button");
    expect(active).toHaveAttribute("aria-current", "page");
  });
  it("calls onNavigate with the link id", async () => {
    const onNavigate = vi.fn();
    render(<Sidebar activeId="dashboard" onNavigate={onNavigate} />);
    await userEvent.click(screen.getByText("Checklist"));
    expect(onNavigate).toHaveBeenCalledWith("checklist");
  });
  it("hides labels when collapsed", () => {
    render(<Sidebar activeId="dashboard" collapsed />);
    expect(screen.getByTestId("sidebar")).toHaveAttribute("data-collapsed", "true");
  });
});
