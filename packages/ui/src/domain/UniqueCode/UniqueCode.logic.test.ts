import { describe, it, expect } from "vitest";
import { isValidCode } from "./UniqueCode.logic";

describe("isValidCode", () => {
  it("accepts VST- followed by 6 uppercase alphanumerics", () => {
    expect(isValidCode("VST-AB12C9")).toBe(true);
    expect(isValidCode("VST-000000")).toBe(true);
  });
  it("rejects wrong prefix, length, or case", () => {
    expect(isValidCode("VS-AB12C9")).toBe(false);
    expect(isValidCode("VST-AB12C")).toBe(false);
    expect(isValidCode("VST-ab12c9")).toBe(false);
    expect(isValidCode("VST-AB12C99")).toBe(false);
  });
});
