import type { InspectionStatus, VehicleStatus } from "@vistoria/contracts";

export type Tone = "neutral" | "info" | "primary" | "success" | "warning" | "danger";

const INSPECTION_TONES: Record<InspectionStatus, Tone> = {
  atribuida: "info",
  em_andamento: "primary",
  concluida: "warning",
  aprovada: "success",
  reprovada: "danger",
};

const VEHICLE_TONES: Record<VehicleStatus, Tone> = {
  disponivel: "success",
  locado: "info",
  manutencao: "warning",
};

const RESULT_TONES: Record<string, Tone> = {
  conforme: "success",
  com_pendencias: "warning",
};

const ITEM_TONES: Record<string, Tone> = {
  conforme: "success",
  nao_conforme: "danger",
  pendente: "warning",
};

const ROLE_TONES: Record<string, Tone> = {
  superadmin: "primary",
  gestor: "info",
  supervisor: "neutral",
  vistoriador: "neutral",
};

/** Best-effort tone resolution for any known status-like string. */
export function toneForStatus(value: string | null | undefined): Tone {
  if (!value) return "neutral";
  return (
    INSPECTION_TONES[value as InspectionStatus] ??
    VEHICLE_TONES[value as VehicleStatus] ??
    RESULT_TONES[value] ??
    ITEM_TONES[value] ??
    ROLE_TONES[value] ??
    "neutral"
  );
}
