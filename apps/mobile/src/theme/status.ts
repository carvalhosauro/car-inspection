import type { InspectionDto, InspectionItemDto } from "@vistoria/contracts";
import type { Tone } from "./index";

export const INSPECTION_STATUS_LABEL: Record<InspectionDto["status"], string> = {
  atribuida: "Atribuída",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  aprovada: "Aprovada",
  reprovada: "Reprovada",
};

export const INSPECTION_STATUS_TONE: Record<InspectionDto["status"], Tone> = {
  atribuida: "info",
  em_andamento: "primary",
  concluida: "warning",
  aprovada: "success",
  reprovada: "danger",
};

export const INSPECTION_TYPE_LABEL: Record<InspectionDto["type"], string> = {
  retirada: "Retirada",
  devolucao: "Devolução",
  periodica: "Periódica",
};

export const ITEM_STATUS_LABEL: Record<InspectionItemDto["status"], string> = {
  pendente: "Pendente",
  conforme: "Conforme",
  nao_conforme: "Não conforme",
};

export const ITEM_STATUS_TONE: Record<InspectionItemDto["status"], Tone> = {
  pendente: "warning",
  conforme: "success",
  nao_conforme: "danger",
};
