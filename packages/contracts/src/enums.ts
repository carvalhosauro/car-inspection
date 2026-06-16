export const USER_ROLES = ["superadmin", "gestor", "supervisor", "vistoriador"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const VEHICLE_STATUSES = ["disponivel", "locado", "manutencao"] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export const INSPECTION_TYPES = ["retirada", "devolucao", "periodica"] as const;
export type InspectionType = (typeof INSPECTION_TYPES)[number];

export const INSPECTION_STATUSES = [
  "atribuida", "em_andamento", "concluida", "aprovada", "reprovada",
] as const;
export type InspectionStatus = (typeof INSPECTION_STATUSES)[number];

export const INSPECTION_RESULTS = ["conforme", "com_pendencias"] as const;
export type InspectionResult = (typeof INSPECTION_RESULTS)[number];

export const ITEM_STATUSES = ["pendente", "conforme", "nao_conforme"] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];
