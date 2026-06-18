import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReportCharts } from "./report-charts";

describe("ReportCharts", () => {
  it("renders the three report sections", () => {
    render(
      <ReportCharts
        damages={[{ vehicleId: "v1", plate: "ABC1D23", damages: 4 }]}
        pending={[{ inspectorId: "u1", name: "João", pending: 2 }]}
        avgTime={[{ type: "retirada", avgMinutes: 25 }]}
      />,
    );
    expect(screen.getByText(/avarias por veículo/i)).toBeInTheDocument();
    expect(screen.getByText(/pendentes por vistoriador/i)).toBeInTheDocument();
    expect(screen.getByText(/tempo médio de vistoria/i)).toBeInTheDocument();
  });
});
