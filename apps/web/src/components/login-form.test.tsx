import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock, refresh: refreshMock }) }));

import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    vi.restoreAllMocks();
  });

  it("posts credentials to /api/session and redirects on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ role: "gestor", name: "Gestor" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/e-mail/i), "g@d.dev");
    await userEvent.type(screen.getByLabelText(/senha/i), "senha123");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("/api/session");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ email: "g@d.dev", password: "senha123" });
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"));
    await waitFor(() => expect(refreshMock).toHaveBeenCalled());
  });

  it("shows an error message on a failed login", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ code: "invalid_credentials", message: "Credenciais inválidas" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/e-mail/i), "g@d.dev");
    await userEvent.type(screen.getByLabelText(/senha/i), "wrong1");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
