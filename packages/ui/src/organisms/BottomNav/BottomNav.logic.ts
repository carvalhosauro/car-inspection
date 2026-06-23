export type TabId = "inicio" | "vistorias" | "camera" | "alertas" | "perfil";

export interface Tab {
  id: TabId;
  label: string;
  center?: boolean;
}

export const DEFAULT_TABS: Tab[] = [
  { id: "inicio", label: "Início" },
  { id: "vistorias", label: "Vistorias" },
  { id: "camera", label: "Câmera", center: true },
  { id: "alertas", label: "Alertas" },
  { id: "perfil", label: "Perfil" },
];

export interface BottomNavProps {
  activeId: string;
  alertCount?: number;
  onTab?: (id: string) => void;
}

const BADGE_MAX_COUNT = 9;

export function formatBadge(count: number): string | null {
  if (count <= 0) return null;
  return count > BADGE_MAX_COUNT ? `${BADGE_MAX_COUNT}+` : String(count);
}
