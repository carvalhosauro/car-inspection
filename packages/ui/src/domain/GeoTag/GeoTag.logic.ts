export interface GeoTagProps {
  city: string;
  state: string;
  validated?: boolean;
}

export function formatLocation(city: string, state: string): string {
  return `${city.trim()}, ${state.trim()}`;
}
