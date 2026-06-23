import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/query-client";
import type { UserDto } from "@vistoria/contracts";
import { UsersTable } from "./users-table";

const createMock = vi.fn();
vi.mock("@/lib/api-browser", () => ({
  browserApi: () => ({ users: { create: createMock, list: vi.fn(), update: vi.fn(), remove: vi.fn() } }),
}));

const USER: UserDto = {
  id: "u1",
  tenantId: "t1",
  name: "Supervisor Demo",
  email: "sup@demo.dev",
  role: "supervisor",
  active: true,
  createdAt: "2026-06-10T10:00:00.000Z",
};

function renderTable() {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <UsersTable initial={[USER]} />
    </QueryClientProvider>,
  );
}

describe("UsersTable", () => {
  beforeEach(() => createMock.mockReset().mockResolvedValue({ ...USER, id: "u2" }));

  it("only offers supervisor and vistoriador roles", async () => {
    renderTable();
    await userEvent.click(screen.getByRole("button", { name: /adicionar/i }));
    const select = screen.getByLabelText(/papel/i) as HTMLSelectElement;
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toEqual(["supervisor", "vistoriador"]);
  });

  it("creates a user through the api-client", async () => {
    renderTable();
    await userEvent.click(screen.getByRole("button", { name: /adicionar/i }));
    await userEvent.type(screen.getByLabelText(/nome/i), "Novo Vistoriador");
    await userEvent.type(screen.getByLabelText(/e-mail/i), "novo@demo.dev");
    await userEvent.type(screen.getByLabelText(/senha/i), "senha123");
    await userEvent.selectOptions(screen.getByLabelText(/papel/i), "vistoriador");
    await userEvent.click(screen.getByRole("button", { name: /criar usuário/i }));

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1));
    expect(createMock.mock.calls[0]![0]).toEqual({
      name: "Novo Vistoriador",
      email: "novo@demo.dev",
      password: "senha123",
      role: "vistoriador",
    });
  });
});
