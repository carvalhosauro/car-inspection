import { describe, it, expect } from "vitest";
import { pageInfo } from "./DataTable.logic";

describe("pageInfo", () => {
  it("disables prev on the first page and enables next when more pages exist", () => {
    expect(pageInfo(1, 3)).toEqual({ page: 1, totalPages: 3, canPrev: false, canNext: true });
  });
  it("enables both controls on a middle page", () => {
    expect(pageInfo(2, 3)).toEqual({ page: 2, totalPages: 3, canPrev: true, canNext: true });
  });
  it("disables next on the last page", () => {
    expect(pageInfo(3, 3)).toEqual({ page: 3, totalPages: 3, canPrev: true, canNext: false });
  });
  it("disables both controls on a single page", () => {
    expect(pageInfo(1, 1)).toEqual({ page: 1, totalPages: 1, canPrev: false, canNext: false });
  });
  it("clamps page below 1 to 1", () => {
    expect(pageInfo(0, 3)).toEqual({ page: 1, totalPages: 3, canPrev: false, canNext: true });
  });
  it("clamps page above totalPages to totalPages", () => {
    expect(pageInfo(9, 3)).toEqual({ page: 3, totalPages: 3, canPrev: true, canNext: false });
  });
  it("treats totalPages below 1 as a single page", () => {
    expect(pageInfo(1, 0)).toEqual({ page: 1, totalPages: 1, canPrev: false, canNext: false });
  });
});
