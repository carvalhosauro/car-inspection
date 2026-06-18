import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GeoTag } from "./GeoTag.web";

describe("GeoTag (web)", () => {
  it("renders the formatted location from lat/lng", () => {
    render(<GeoTag lat={-23.5505} lng={-46.6333} />);
    expect(screen.getByText("-23.550500, -46.633300")).toBeInTheDocument();
  });

  it("renders address when provided instead of lat/lng", () => {
    render(<GeoTag lat={-23.5505} lng={-46.6333} address="São Paulo, SP" />);
    expect(screen.getByText("São Paulo, SP")).toBeInTheDocument();
  });

  it("shows pending label by default", () => {
    render(<GeoTag lat={-23.5505} lng={-46.6333} />);
    expect(screen.getByText("Aguardando GPS...")).toBeInTheDocument();
  });

  it("shows acquired label when status is acquired", () => {
    render(<GeoTag lat={-23.5505} lng={-46.6333} status="acquired" />);
    expect(screen.getByText("Localização obtida")).toBeInTheDocument();
  });

  it("shows error label when status is error", () => {
    render(<GeoTag lat={-23.5505} lng={-46.6333} status="error" />);
    expect(screen.getByText("Erro de GPS")).toBeInTheDocument();
  });
});
