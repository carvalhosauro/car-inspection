import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard.web";

describe("StatCard (web)", () => {
  it("renders value and label", () => {
    render(<StatCard value="120" label="Vistorias hoje" />);
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("Vistorias hoje")).toBeInTheDocument();
  });
  it("renders an upward change with arrow", () => {
    render(<StatCard value="120" label="x" change="12%" changeDirection="up" />);
    expect(screen.getByText(/↑/)).toBeInTheDocument();
    expect(screen.getByText(/12%/)).toBeInTheDocument();
  });
  it("omits change block when not provided", () => {
    render(<StatCard value="120" label="x" />);
    expect(screen.queryByText(/↑|↓/)).not.toBeInTheDocument();
  });
});
