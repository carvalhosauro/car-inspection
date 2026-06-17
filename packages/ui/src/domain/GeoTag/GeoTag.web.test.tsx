import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GeoTag } from "./GeoTag.web";

describe("GeoTag (web)", () => {
  it("renders the formatted location", () => {
    render(<GeoTag city="São Paulo" state="SP" />);
    expect(screen.getByText("São Paulo, SP")).toBeInTheDocument();
  });
  it("shows the validated label when validated", () => {
    render(<GeoTag city="São Paulo" state="SP" validated />);
    expect(screen.getByText("Localização validada")).toBeInTheDocument();
  });
  it("omits the validated label by default", () => {
    render(<GeoTag city="São Paulo" state="SP" />);
    expect(screen.queryByText("Localização validada")).not.toBeInTheDocument();
  });
});
