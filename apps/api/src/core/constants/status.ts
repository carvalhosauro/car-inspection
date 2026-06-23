export const INSPECTION_STATUS = {
  atribuida: "atribuida",
  em_andamento: "em_andamento",
  concluida: "concluida",
  aprovada: "aprovada",
  reprovada: "reprovada",
} as const;

export type InspectionStatus = (typeof INSPECTION_STATUS)[keyof typeof INSPECTION_STATUS];

export const INSPECTION_RESULT = {
  conforme: "conforme",
  com_pendencias: "com_pendencias",
} as const;

export type InspectionResult = (typeof INSPECTION_RESULT)[keyof typeof INSPECTION_RESULT];

export const ITEM_STATUS = {
  pendente: "pendente",
  conforme: "conforme",
  nao_conforme: "nao_conforme",
} as const;

export type ItemStatus = (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS];

export const VEHICLE_STATUS = {
  disponivel: "disponivel",
  locado: "locado",
  manutencao: "manutencao",
} as const;

export type VehicleStatus = (typeof VEHICLE_STATUS)[keyof typeof VEHICLE_STATUS];

export const PROOF_KIND = {
  photo: "photo",
  ocr_plate: "ocr_plate",
  ocr_km: "ocr_km",
  geo: "geo",
  unique_code: "unique_code",
  signature: "signature",
} as const;

export type ProofKind = (typeof PROOF_KIND)[keyof typeof PROOF_KIND];
