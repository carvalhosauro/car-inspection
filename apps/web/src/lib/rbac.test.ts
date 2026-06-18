import { describe, it, expect } from "vitest";
import { can } from "./rbac";

describe("rbac matrix (spec §6.4)", () => {
  it("only gestor manages tenant users", () => {
    expect(can("gestor", "manageUsers")).toBe(true);
    expect(can("supervisor", "manageUsers")).toBe(false);
    expect(can("superadmin", "manageUsers")).toBe(false);
  });

  it("gestor and supervisor do vehicle CRUD", () => {
    expect(can("gestor", "crudVehicles")).toBe(true);
    expect(can("supervisor", "crudVehicles")).toBe(true);
    expect(can("superadmin", "crudVehicles")).toBe(false);
  });

  it("only gestor CRUDs checklist templates", () => {
    expect(can("gestor", "crudTemplates")).toBe(true);
    expect(can("supervisor", "crudTemplates")).toBe(false);
  });

  it("gestor and supervisor assign and audit inspections", () => {
    expect(can("gestor", "assignInspections")).toBe(true);
    expect(can("supervisor", "assignInspections")).toBe(true);
    expect(can("gestor", "auditInspections")).toBe(true);
    expect(can("supervisor", "auditInspections")).toBe(true);
  });

  it("superadmin, gestor and supervisor see reports", () => {
    expect(can("superadmin", "viewReports")).toBe(true);
    expect(can("gestor", "viewReports")).toBe(true);
    expect(can("supervisor", "viewReports")).toBe(true);
  });

  it("vistoriador can do nothing in the web matrix", () => {
    expect(can("vistoriador", "crudVehicles")).toBe(false);
    expect(can("vistoriador", "viewReports")).toBe(false);
  });
});
