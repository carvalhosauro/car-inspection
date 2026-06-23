import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InspectionFilters } from "./inspection-filters";
import type { FiltersState } from "./inspection-filters";

function renderFilters(value: FiltersState = {}, onChange = vi.fn()) {
  return { onChange, ...render(<InspectionFilters value={value} onChange={onChange} />) };
}

describe("InspectionFilters", () => {
  it("renders the status filter select", () => {
    renderFilters();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it("calls onChange with the selected status", async () => {
    const { onChange } = renderFilters();
    await userEvent.selectOptions(screen.getByLabelText(/status/i), "aprovada");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ status: "aprovada" }));
  });

  it("renders with the current filter status selected", () => {
    renderFilters({ status: "em_andamento" });
    const select = screen.getByLabelText(/status/i) as HTMLSelectElement;
    expect(select.value).toBe("em_andamento");
  });

  it("calls onChange with undefined status when blank option is selected", async () => {
    const { onChange } = renderFilters({ status: "aprovada" });
    await userEvent.selectOptions(screen.getByLabelText(/status/i), "");
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ status: undefined }));
  });
});
