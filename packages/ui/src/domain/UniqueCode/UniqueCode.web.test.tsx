import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UniqueCode } from "./UniqueCode.web";

describe("UniqueCode (web)", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("renders the code", () => {
    render(<UniqueCode code="VST-AB12C9" />);
    expect(screen.getByText("VST-AB12C9")).toBeInTheDocument();
  });
  it("copies to clipboard and fires onCopied when the copy button is clicked", async () => {
    const onCopied = vi.fn();
    render(<UniqueCode code="VST-AB12C9" onCopied={onCopied} />);
    await userEvent.click(screen.getByRole("button", { name: /copiar/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("VST-AB12C9");
    expect(onCopied).toHaveBeenCalledOnce();
  });
  it("shows a copied confirmation after copying", async () => {
    render(<UniqueCode code="VST-AB12C9" />);
    await userEvent.click(screen.getByRole("button", { name: /copiar/i }));
    expect(await screen.findByText("Copiado!")).toBeInTheDocument();
  });
});
