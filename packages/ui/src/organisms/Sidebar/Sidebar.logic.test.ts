import { describe, it, expect } from "vitest";
import { DEFAULT_LINKS, isActive } from "./Sidebar.logic";

describe("Sidebar logic", () => {
  it("ships the eight default nav links in order", () => {
    expect(DEFAULT_LINKS.map((l) => l.label)).toEqual([
      "Dashboard", "Frota", "Checklist", "Vistorias",
      "Auditoria", "Relatórios", "Configurações", "Usuários"
    ]);
  });
  it("isActive matches by id", () => {
    expect(isActive("dashboard", "dashboard")).toBe(true);
    expect(isActive("frota", "dashboard")).toBe(false);
  });
});
