import { colors } from "../../tokens";

export type BadgeVariant =
  | "concluido"
  | "em-andamento"
  | "pendente"
  | "reprovado"
  | "agendado";

export interface BadgeConfig {
  label: string;
  icon: string;
  color: string;
  bg: string;
}

export const BADGE_CONFIG: Record<BadgeVariant, BadgeConfig> = {
  concluido: { label: "Concluído", icon: "✓", color: colors.success, bg: "#DCFCE7" },
  "em-andamento": { label: "Em andamento", icon: "•", color: colors.primary, bg: "#DBEAFE" },
  pendente: { label: "Pendente", icon: "!", color: colors.warning, bg: "#FEF3C7" },
  reprovado: { label: "Reprovado", icon: "✕", color: colors.error, bg: "#FEE2E2" },
  agendado: { label: "Agendado", icon: "◷", color: colors.neutral600, bg: "#F1F5F9" },
};

export interface BadgeProps {
  variant: BadgeVariant;
}
