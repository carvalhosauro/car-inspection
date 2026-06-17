import { colors } from "../../tokens";

export type BadgeVariant =
  | "concluido"
  | "em-andamento"
  | "pendente"
  | "reprovado"
  | "agendado";

export type BadgeIcon =
  | "CheckCircle2"
  | "Clock3"
  | "AlertCircle"
  | "XCircle"
  | "CalendarClock";

export interface BadgeConfig {
  label: string;
  icon: BadgeIcon;
  color: string;
  bg: string;
}

export const BADGE_CONFIG: Record<BadgeVariant, BadgeConfig> = {
  concluido: { label: "Concluído", icon: "CheckCircle2", color: colors.success, bg: "#DCFCE7" },
  "em-andamento": { label: "Em andamento", icon: "Clock3", color: colors.primary, bg: "#DBEAFE" },
  pendente: { label: "Pendente", icon: "AlertCircle", color: colors.warning, bg: "#FEF3C7" },
  reprovado: { label: "Reprovado", icon: "XCircle", color: colors.error, bg: "#FEE2E2" },
  agendado: { label: "Agendado", icon: "CalendarClock", color: colors.neutral600, bg: "#F1F5F9" },
};

export interface BadgeProps {
  variant: BadgeVariant;
}
