import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChecklistItem } from "./ChecklistItem.web";

describe("ChecklistItem (web)", () => {
  it("renders label and sublabel", () => {
    render(<ChecklistItem state="conforme" label="Pneus" sublabel="Sem desgaste" />);
    expect(screen.getByText("Pneus")).toBeInTheDocument();
    expect(screen.getByText("Sem desgaste")).toBeInTheDocument();
  });
  it("exposes state via data attribute", () => {
    render(<ChecklistItem state="nao-conforme" label="Farol" />);
    expect(screen.getByText("Farol").closest("[data-state]"))
      .toHaveAttribute("data-state", "nao-conforme");
  });
  it("omits sublabel when absent", () => {
    render(<ChecklistItem state="pendente" label="Vidros" />);
    expect(screen.getByText("Vidros")).toBeInTheDocument();
  });
});
