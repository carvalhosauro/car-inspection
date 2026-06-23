import { saveRefreshToken, getRefreshToken, clearRefreshToken } from "./secure-token-store";

describe("secure-token-store", () => {
  it("returns null before anything is saved", async () => {
    await clearRefreshToken();
    expect(await getRefreshToken()).toBeNull();
  });

  it("persists and reads back the refresh token", async () => {
    await saveRefreshToken("refresh-abc");
    expect(await getRefreshToken()).toBe("refresh-abc");
  });

  it("clears the refresh token", async () => {
    await saveRefreshToken("refresh-xyz");
    await clearRefreshToken();
    expect(await getRefreshToken()).toBeNull();
  });
});
