// @vitest-environment node
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  fileURLToPath(new URL("./web.css", import.meta.url)),
  "utf8"
);

describe("web.css custom properties", () => {
  it("mirrors the brand colors", () => {
    expect(css).toContain("--color-primary: #2563EB;");
    expect(css).toContain("--color-success: #22C55E;");
    expect(css).toContain("--color-error: #EF4444;");
    expect(css).toContain("--color-warning: #F59E0B;");
    expect(css).toContain("--color-neutral-300: #CBD5E1;");
  });
  it("mirrors typography sizes", () => {
    expect(css).toContain("--font-h1-size: 40px;");
    expect(css).toContain("--font-small-size: 12px;");
  });
});
