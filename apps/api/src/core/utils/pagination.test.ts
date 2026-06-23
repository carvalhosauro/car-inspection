import { describe, it, expect } from "vitest";
import { buildPage } from "./pagination.js";

type Row = { id: string; name: string };

const toItem = (row: Row) => ({ id: row.id, name: row.name });

describe("buildPage", () => {
  it("slices to limit and sets nextCursor when rows exceed limit", () => {
    const rows: Row[] = [
      { id: "a", name: "foo" },
      { id: "b", name: "bar" },
      { id: "c", name: "baz" },
    ];
    const result = buildPage(rows, 2, toItem);
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toEqual({ id: "a", name: "foo" });
    expect(result.items[1]).toEqual({ id: "b", name: "bar" });
    expect(result.nextCursor).toBe("b");
  });

  it("returns all items with null nextCursor when rows equal limit", () => {
    const rows: Row[] = [
      { id: "a", name: "foo" },
      { id: "b", name: "bar" },
    ];
    const result = buildPage(rows, 2, toItem);
    expect(result.items).toHaveLength(2);
    expect(result.nextCursor).toBeNull();
  });

  it("returns all items with null nextCursor when rows are fewer than limit", () => {
    const rows: Row[] = [{ id: "a", name: "foo" }];
    const result = buildPage(rows, 10, toItem);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({ id: "a", name: "foo" });
    expect(result.nextCursor).toBeNull();
  });

  it("applies toItem mapping to each row", () => {
    const rows: Row[] = [
      { id: "x", name: "hello" },
      { id: "y", name: "world" },
    ];
    const pickName = (row: Row) => ({ label: row.name });
    const result = buildPage(rows, 5, pickName);
    expect(result.items).toEqual([{ label: "hello" }, { label: "world" }]);
    expect(result.nextCursor).toBeNull();
  });

  it("returns empty items and null nextCursor for empty rows", () => {
    const result = buildPage([], 10, toItem);
    expect(result.items).toEqual([]);
    expect(result.nextCursor).toBeNull();
  });

  it("returns empty items slice and sets cursor when limit is 0 and rows exist", () => {
    const rows: Row[] = [{ id: "a", name: "foo" }];
    const result = buildPage(rows, 0, toItem);
    expect(result.items).toEqual([]);
    expect(result.nextCursor).toBeNull();
  });
});
