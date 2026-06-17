import { colors } from "../../tokens";

export type AiVerdict = "aprovada" | "recusada";

export type AiIcon = "CheckCircle2" | "XCircle";

export const AI_CONFIG: Record<AiVerdict, { icon: AiIcon; color: string; message: string }> = {
  aprovada: { icon: "CheckCircle2", color: colors.success, message: "Foto aprovada pela IA" },
  recusada: { icon: "XCircle", color: colors.error, message: "Foto recusada pela IA" },
};

export interface AiPhotoResultProps {
  verdict: AiVerdict;
  reason?: string;
}
