import { colors } from "../../tokens";

export type AiVerdict = "aprovada" | "recusada";

export const AI_CONFIG: Record<AiVerdict, { icon: string; color: string; message: string }> = {
  aprovada: { icon: "✓", color: colors.success, message: "Foto aprovada pela IA" },
  recusada: { icon: "✕", color: colors.error, message: "Foto recusada pela IA" },
};

export interface AiPhotoResultProps {
  verdict: AiVerdict;
  reason?: string;
}
