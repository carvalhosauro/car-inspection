export interface Tab {
  id: string;
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

export function formatBadge(count: number): string | null {
  if (count <= 0) return null;
  return count > 9 ? "9+" : String(count);
}
