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

  it("does not call onFiles when all dropped files are invalid", () => {
    const onFiles = vi.fn();
    render(<UploadArea onFiles={onFiles} />);
    const area = screen.getByTestId("upload-area");
    const pdf = new File(["x"], "doc.pdf", { type: "application/pdf" });
    fireEvent.drop(area, { dataTransfer: { files: [pdf] } });
    expect(onFiles).not.toHaveBeenCalled();
  });

  it("filters invalid files from a mixed drop, calling onFiles only with valid ones", () => {
    const onFiles = vi.fn();
    render(<UploadArea onFiles={onFiles} />);
    const area = screen.getByTestId("upload-area");
    const png = new File(["x"], "p.png", { type: "image/png" });
    const pdf = new File(["x"], "doc.pdf", { type: "application/pdf" });
    fireEvent.drop(area, { dataTransfer: { files: [png, pdf] } });
    expect(onFiles).toHaveBeenCalledWith([png]);
  });

  it("the file input accepts only image/png and image/jpeg", () => {
    render(<UploadArea />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.accept).toBe("image/png,image/jpeg");
  });

  it("shows the file size limit in the instructions", () => {
    render(<UploadArea />);
    expect(screen.getByText(/10MB/i)).toBeInTheDocument();
  });
});
