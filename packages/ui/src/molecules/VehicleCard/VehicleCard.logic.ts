import type { BadgeVariant } from "../../atoms/Badge";

export interface VehicleCardProps {
  plate: string;
  model: string;
  year: number;
  km: number;
  status: BadgeVariant;
  progress: number;
  imageUrl?: string;
  onPress?: () => void;
}

export function formatKm(km: number): string {
  return `${km.toLocaleString("pt-BR")} km`;
}
