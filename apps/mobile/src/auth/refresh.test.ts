import { ensureFreshAccess } from "./refresh";
import { getAccess, setAccess } from "./token-memory";

// Prefixed `mock` so babel-jest's jest.mock hoisting guard allows the factory
// to reference it (jest-expo @ SDK 56 enforces this; the plan's name `refresh`
// is rejected as an out-of-scope variable).
const mockRefresh = jest.fn(async () => ({ accessToken: "fresh-access" }));
jest.mock("@vistoria/api-client", () => ({
  createApiClient: () => ({ auth: { refresh: mockRefresh } }),
  ApiError: class ApiError extends Error {},
}));
// secure-store is mocked in jest.setup; seed it via the wrapper.
import { saveRefreshToken, clearRefreshToken } from "@/lib/secure-token-store";

describe("ensureFreshAccess", () => {
  beforeEach(async () => {
    mockRefresh.mockClear();
    setAccess(null);
    await clearRefreshToken();
  });

  it("returns false and stays logged out with no refresh token", async () => {
    expect(await ensureFreshAccess()).toBe(false);
    expect(mockRefresh).not.toHaveBeenCalled();
    expect(getAccess()).toBeNull();
  });

  it("mints a fresh access token from the stored refresh token", async () => {
    await saveRefreshToken("refresh-abc");
    expect(await ensureFreshAccess()).toBe(true);
    expect(mockRefresh).toHaveBeenCalledWith("refresh-abc");
    expect(getAccess()).toBe("fresh-access");
  });

  it("dedupes concurrent calls into a single refresh (singleton in-flight)", async () => {
    await saveRefreshToken("refresh-abc");
    await Promise.all([ensureFreshAccess(), ensureFreshAccess(), ensureFreshAccess()]);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
