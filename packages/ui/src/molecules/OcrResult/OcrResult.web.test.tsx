import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OcrResult } from "./OcrResult.web";

describe("OcrResult (web)", () => {
  it("renders the type label and value", () => {
    render(<OcrResult type="placa" value="ABC1D23" />);
    expect(screen.getByText("Placa")).toBeInTheDocument();
    expect(screen.getByText("ABC1D23")).toBeInTheDocument();
  });
  it("renders Validado badge when validated", () => {
    render(<OcrResult type="hodometro" value="45000" validated />);
    expect(screen.getByText("Validado")).toBeInTheDocument();
  });
  it("omits the badge when not validated", () => {
    render(<OcrResult type="hodometro" value="45000" />);
    expect(screen.queryByText("Validado")).not.toBeInTheDocument();
  });
});
