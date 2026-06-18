import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge.web";

describe("Badge (web)", () => {
  it("renders the variant label", () => {
    render(<Badge variant="concluido" />);
    expect(screen.getByText("Concluído")).toBeInTheDocument();
  });
  it("exposes the variant via data attribute", () => {
    render(<Badge variant="reprovado" />);
    expect(screen.getByText("Reprovado").closest("[data-variant]"))
      .toHaveAttribute("data-variant", "reprovado");
  });
  it("renders pendente label", () => {
    render(<Badge variant="pendente" />);
    expect(screen.getByText("Pendente")).toBeInTheDocument();
  });
});
