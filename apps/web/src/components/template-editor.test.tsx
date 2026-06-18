import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/query-client";
import { PROOF_KINDS } from "@vistoria/contracts";
import { TemplateEditor } from "./template-editor";

const createMock = vi.fn();
vi.mock("@/lib/api-browser", () => ({
  browserApi: () => ({ base: { templates: { create: createMock } } }),
}));

function renderEditor() {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <TemplateEditor />
    </QueryClientProvider>,
  );
}

describe("TemplateEditor", () => {
  beforeEach(() => createMock.mockReset());

  it("offers every PROOF_KIND as a requirement option", () => {
    renderEditor();
    const select = screen.getByLabelText(/tipo de prova/i) as HTMLSelectElement;
    const values = Array.from(select.options).map((o) => o.value);
    for (const kind of PROOF_KINDS) expect(values).toContain(kind);
  });

  it("builds and submits a template with items and requirements", async () => {
    createMock.mockResolvedValue({ id: "tpl1" });
    renderEditor();

    await userEvent.type(screen.getByLabelText(/nome do template/i), "Vistoria de Retirada");
    await userEvent.type(screen.getByLabelText(/rótulo do item/i), "Para-choque dianteiro");
    await userEvent.selectOptions(screen.getByLabelText(/tipo de prova/i), "photo");
    await userEvent.click(screen.getByRole("button", { name: /adicionar requisito/i }));
    await userEvent.click(screen.getByRole("button", { name: /adicionar item/i }));
    await userEvent.click(screen.getByRole("button", { name: /salvar template/i }));

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1));
    const payload = createMock.mock.calls[0]![0];
    expect(payload.name).toBe("Vistoria de Retirada");
    expect(payload.items[0].label).toBe("Para-choque dianteiro");
    expect(payload.items[0].requirements[0].kind).toBe("photo");
  });
});
