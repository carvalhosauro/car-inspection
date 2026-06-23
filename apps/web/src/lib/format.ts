import type { InspectionStatus } from "@vistoria/contracts";

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatPlate(plate: string): string {
  return plate.trim().toUpperCase();
}

const STATUS_LABELS: Record<InspectionStatus, string> = {
  atribuida: "Atribuída",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  aprovada: "Aprovada",
  reprovada: "Reprovada",
};

export function formatInspectionStatus(status: InspectionStatus): string {
  return STATUS_LABELS[status];
}
