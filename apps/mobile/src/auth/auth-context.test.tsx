import { Text, Pressable } from "react-native";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "./auth-context";
import { getAccess } from "./token-memory";
import { clearRefreshToken } from "@/lib/secure-token-store";

const mockLogin = jest.fn(async () => ({
  accessToken: "access-123",
  refreshToken: "refresh-123",
}));
const mockRefresh = jest.fn(async () => ({ accessToken: "fresh-access" }));

// Mock the api-client so the context test never hits the network.
jest.mock("@vistoria/api-client", () => ({
  createApiClient: () => ({ auth: { login: mockLogin, refresh: mockRefresh } }),
  ApiError: class ApiError extends Error {},
}));

function Harness() {
  const { isAuthenticated, bootstrapped, login } = useAuth();
  return (
    <>
      <Text testID="state">{bootstrapped ? (isAuthenticated ? "authed" : "anon") : "boot"}</Text>
      <Pressable testID="login" onPress={() => login({ email: "a@b.c", password: "secret1" })}>
        <Text>login</Text>
      </Pressable>
    </>
  );
}

describe("AuthProvider", () => {
  beforeEach(async () => {
    mockLogin.mockClear();
    await clearRefreshToken(); // no stored session → bootstrap lands anonymous
  });

  it("bootstraps anonymous when no refresh token is stored", async () => {
    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("state").props.children).toBe("anon"));
  });

  it("becomes authenticated after a successful login", async () => {
    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("state").props.children).toBe("anon"));
    fireEvent.press(screen.getByTestId("login"));
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({ email: "a@b.c", password: "secret1" }));
    await waitFor(() => expect(screen.getByTestId("state").props.children).toBe("authed"));
    expect(getAccess()).toBe("access-123");
  });
});
