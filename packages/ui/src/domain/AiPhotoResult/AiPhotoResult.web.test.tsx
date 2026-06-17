import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AiPhotoResult } from "./AiPhotoResult.web";

describe("AiPhotoResult (web)", () => {
  it("renders the approval message for aprovada", () => {
    render(<AiPhotoResult verdict="aprovada" />);
    expect(screen.getByText("Foto aprovada pela IA")).toBeInTheDocument();
    expect(screen.getByTestId("ai-result")).toHaveAttribute("data-verdict", "aprovada");
  });
  it("renders the rejection reason for recusada", () => {
    render(<AiPhotoResult verdict="recusada" reason="Imagem desfocada" />);
    expect(screen.getByText("Foto recusada pela IA")).toBeInTheDocument();
    expect(screen.getByText("Imagem desfocada")).toBeInTheDocument();
  });
  it("omits the reason when not provided", () => {
    render(<AiPhotoResult verdict="recusada" />);
    expect(screen.getByText("Foto recusada pela IA")).toBeInTheDocument();
  });
});
