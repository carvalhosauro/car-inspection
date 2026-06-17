import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UploadArea } from "./UploadArea.web";

describe("UploadArea (web)", () => {
  it("renders idle instructions", () => {
    render(<UploadArea />);
    expect(screen.getByText(/arraste|clique/i)).toBeInTheDocument();
  });
  it("exposes state via data attribute", () => {
    render(<UploadArea state="uploading" />);
    expect(screen.getByTestId("upload-area")).toHaveAttribute("data-state", "uploading");
  });
  it("toggles to dragging on dragOver and back on dragLeave", () => {
    render(<UploadArea />);
    const area = screen.getByTestId("upload-area");
    fireEvent.dragOver(area);
    expect(area).toHaveAttribute("data-state", "dragging");
    fireEvent.dragLeave(area);
    expect(area).toHaveAttribute("data-state", "idle");
  });
  it("emits valid dropped files via onFiles", () => {
    const onFiles = vi.fn();
    render(<UploadArea onFiles={onFiles} />);
    const area = screen.getByTestId("upload-area");
    const file = new File(["x"], "p.png", { type: "image/png" });
    fireEvent.drop(area, { dataTransfer: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
  });
});
