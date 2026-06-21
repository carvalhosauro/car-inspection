import { signAndUpload } from "./upload";
import { manipulateAsync } from "expo-image-manipulator";

describe("signAndUpload", () => {
  const SIGNED_URL =
    "https://storage.example/object/upload/sign/bucket/photo-1.jpg?token=abc";

  function makeSign() {
    return jest.fn(async (_b: { contentType: string }) => ({
      filePath: "tenant/insp/photo-1.jpg",
      signedUrl: SIGNED_URL,
      token: "abc",
    }));
  }

  beforeEach(() => {
    (manipulateAsync as jest.Mock).mockClear();
    // single fetch: the multipart PUT to the signed url.
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, status: 200 }) as unknown as typeof fetch;
  });

  it("resizes, requests a signed url, PUTs multipart bytes, and returns the filePath", async () => {
    const sign = makeSign();
    const filePath = await signAndUpload("file:///tmp/original.jpg", sign);

    expect(manipulateAsync).toHaveBeenCalledTimes(1);
    expect(sign).toHaveBeenCalledWith({ contentType: "image/jpeg" });
    const putCall = (global.fetch as jest.Mock).mock.calls[0];
    expect(putCall[0]).toBe(SIGNED_URL);
    expect(putCall[1].method).toBe("PUT");
    expect(putCall[1].body).toBeInstanceOf(FormData);
    expect(filePath).toBe("tenant/insp/photo-1.jpg");
  });

  it("throws when the storage PUT fails", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500 }) as unknown as typeof fetch;
    const sign = makeSign();
    await expect(signAndUpload("file:///tmp/original.jpg", sign)).rejects.toThrow(
      "Upload failed",
    );
  });
});
