import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UniqueCode } from "./UniqueCode.web";

describe("UniqueCode (web)", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
  it("shows a copied confirmation and hides it after the timeout", async () => {
    vi.useFakeTimers();
    render(<UniqueCode code="VST-AB12C9" />);
    // fire click synchronously; await the clipboard promise resolution
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /copiar/i }));
    });
    expect(screen.getByText("Copiado!")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.queryByText("Copiado!")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
