import type { UserRole } from "@vistoria/contracts";

export type Action =
  | "manageUsers"
  | "crudVehicles"
  | "crudTemplates"
  | "assignInspections"
  | "auditInspections"
  | "viewReports";

// Direct transcription of the spec §6.4 permission matrix (web-relevant rows).
const MATRIX: Record<Action, ReadonlySet<UserRole>> = {
  manageUsers: new Set<UserRole>(["gestor"]),
  crudVehicles: new Set<UserRole>(["gestor", "supervisor"]),
  crudTemplates: new Set<UserRole>(["gestor"]),
  assignInspections: new Set<UserRole>(["gestor", "supervisor"]),
  auditInspections: new Set<UserRole>(["gestor", "supervisor"]),
  viewReports: new Set<UserRole>(["superadmin", "gestor", "supervisor"]),
};

export function can(role: UserRole, action: Action): boolean {
  return MATRIX[action].has(role);
}
