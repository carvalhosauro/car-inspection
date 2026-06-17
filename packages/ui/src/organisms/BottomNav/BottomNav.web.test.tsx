import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomNav } from "./BottomNav.web";

describe("BottomNav (web mirror)", () => {
  it("renders all five tabs", () => {
    render(<BottomNav activeId="inicio" />);
    ["Início", "Vistorias", "Câmera", "Alertas", "Perfil"].forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument(),
    );
  });
  it("marks the center tab as elevated", () => {
    render(<BottomNav activeId="inicio" />);
    expect(screen.getByText("Câmera").closest("[data-center]")).toHaveAttribute(
      "data-center",
      "true",
    );
  });
  it("renders an alert badge when alertCount > 0", () => {
    render(<BottomNav activeId="inicio" alertCount={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });
  it("does not render a badge when alertCount is 0", () => {
    render(<BottomNav activeId="inicio" alertCount={0} />);
    expect(screen.queryByTestId("alert-badge")).not.toBeInTheDocument();
  });
  it("fires onTab with the tab id", async () => {
    const onTab = vi.fn();
    render(<BottomNav activeId="inicio" onTab={onTab} />);
    await userEvent.click(screen.getByText("Perfil"));
    expect(onTab).toHaveBeenCalledWith("perfil");
  });
});
