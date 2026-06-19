import { describe, it, expect, beforeEach } from "vitest";
import { getAccessToken, setAccessToken } from "./token-store";

describe("token-store", () => {
  beforeEach(() => setAccessToken(null));

  it("returns null before any token is set", () => {
    expect(getAccessToken()).toBeNull();
  });

  it("returns the token after setAccessToken", () => {
    setAccessToken("tok_abc");
    expect(getAccessToken()).toBe("tok_abc");
  });

  it("clears the token when set to null", () => {
    setAccessToken("tok_abc");
    setAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });
});
