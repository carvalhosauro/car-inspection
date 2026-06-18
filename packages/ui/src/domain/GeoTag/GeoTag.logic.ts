export type GeoStatus = 'pending' | 'acquired' | 'error';

export const GEO_STATUS_CONFIG: Record<GeoStatus, { label: string; colorVar: string }> = {
  pending:  { label: "Aguardando GPS...", colorVar: "var(--color-neutral-600)" },
  acquired: { label: "Localização obtida", colorVar: "var(--color-success)" },
  error:    { label: "Erro de GPS", colorVar: "var(--color-error)" },
};

export interface GeoTagProps {
  lat: number;
  lng: number;
  status?: GeoStatus; // default: 'pending'
  address?: string;
}

export function formatLocation(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}
