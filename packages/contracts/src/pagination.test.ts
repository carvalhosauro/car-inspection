import { describe, it, expect } from "vitest";
import { paginationQuerySchema, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "./pagination";

describe("pagination constants", () => {
  it("DEFAULT_PAGE_SIZE is 20", () => {
    expect(DEFAULT_PAGE_SIZE).toBe(20);
  });

  it("MAX_PAGE_SIZE is 100", () => {
    expect(MAX_PAGE_SIZE).toBe(100);
  });
});

describe("paginationQuerySchema", () => {
  it("parses valid input with explicit limit", () => {
    const parsed = paginationQuerySchema.parse({ limit: 50 });
    expect(parsed.limit).toBe(50);
  });

  it("uses default limit when omitted", () => {
    const parsed = paginationQuerySchema.parse({});
    expect(parsed.limit).toBe(DEFAULT_PAGE_SIZE);
  });

  it("coerces string '10' to number 10", () => {
    const parsed = paginationQuerySchema.parse({ limit: "10" });
    expect(parsed.limit).toBe(10);
  });

  it("parses optional cursor as uuid", () => {
    const parsed = paginationQuerySchema.parse({
      cursor: "00000000-0000-4000-a000-000000000001",
    });
    expect(parsed.cursor).toBe("00000000-0000-4000-a000-000000000001");
  });

  it("rejects limit greater than 100", () => {
    expect(() => paginationQuerySchema.parse({ limit: 101 })).toThrow();
  });

  it("rejects limit less than 1", () => {
    expect(() => paginationQuerySchema.parse({ limit: 0 })).toThrow();
  });

  it("rejects non-uuid cursor", () => {
    expect(() => paginationQuerySchema.parse({ cursor: "not-a-uuid" })).toThrow();
  });
});
