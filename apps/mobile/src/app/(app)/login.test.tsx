import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../(auth)/login";

const mockLogin = jest.fn(async () => undefined);
jest.mock("@/auth/auth-context", () => ({
  useAuth: () => ({ login: mockLogin }),
}));
jest.mock("expo-router", () => ({ useRouter: () => ({ replace: jest.fn() }) }));

describe("LoginScreen", () => {
  beforeEach(() => mockLogin.mockClear());

  it("submits email + password to auth.login", async () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByTestId("email"), "vistoriador@demo.dev");
    fireEvent.changeText(screen.getByTestId("password"), "senha123");
    fireEvent.press(screen.getByTestId("submit"));
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        email: "vistoriador@demo.dev",
        password: "senha123",
      }),
    );
  });

  it("shows an error message when login rejects", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Credenciais inválidas"));
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByTestId("email"), "x@y.z");
    fireEvent.changeText(screen.getByTestId("password"), "wrongpw");
    fireEvent.press(screen.getByTestId("submit"));
    await waitFor(() =>
      expect(screen.getByTestId("error").props.children).toBe("Credenciais inválidas"),
    );
  });
});
