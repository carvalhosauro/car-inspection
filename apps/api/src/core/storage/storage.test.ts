import { describe, it, expect, vi, beforeEach } from "vitest";

const createSignedUploadUrl = vi.fn();
const download = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({ createSignedUploadUrl, download }),
    },
  }),
}));

import { signUploadUrl, downloadBytes } from "./index.js";
import { resetEnvCache } from "../../env.js";

describe("storage (supabase driver)", () => {
  beforeEach(() => {
    resetEnvCache();
    process.env.STORAGE_DRIVER = "supabase";
    process.env.SUPABASE_URL = "http://localhost:54321";
    process.env.SUPABASE_SERVICE_KEY = "test-key";
    process.env.SUPABASE_STORAGE_BUCKET = "vistoria-photos";
    process.env.DATABASE_URL = "postgresql://u:p@localhost:5432/db";
    process.env.JWT_SECRET = "a";
    process.env.JWT_REFRESH_SECRET = "b";
  });

  it("signUploadUrl returns the path, signedUrl and token", async () => {
    createSignedUploadUrl.mockResolvedValueOnce({
      data: { path: "p/1.jpg", token: "tok", signedUrl: "http://x/upload" },
      error: null,
    });
    const out = await signUploadUrl("p/1.jpg");
    expect(out.filePath).toBe("p/1.jpg");
    expect(out.signedUrl).toBe("http://x/upload");
    expect(out.token).toBe("tok");
  });

  it("downloadBytes returns a Buffer of the file", async () => {
    const bytes = new Uint8Array([1, 2, 3]);
    download.mockResolvedValueOnce({
      data: { arrayBuffer: async () => bytes.buffer },
      error: null,
    });
    const buf = await downloadBytes("p/1.jpg");
    expect(Buffer.from(buf)).toEqual(Buffer.from(bytes));
  });

  it("downloadBytes throws when supabase returns an error", async () => {
    download.mockResolvedValueOnce({ data: null, error: { message: "nope" } });
    await expect(downloadBytes("missing.jpg")).rejects.toThrow();
  });
});
