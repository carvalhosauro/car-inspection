export type ColumnType = "text" | "status" | "actions";

export interface Column<T> {
  key: keyof T & string;
  header: string;
  type?: ColumnType;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  page?: number;
  totalPages?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
}

export interface PageInfo {
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
}

export function pageInfo(page: number, totalPages: number): PageInfo {
  const safeTotal = totalPages < 1 ? 1 : totalPages;
  const clamped = page < 1 ? 1 : page > safeTotal ? safeTotal : page;
  return {
    page: clamped,
    totalPages: safeTotal,
    canPrev: clamped > 1,
    canNext: clamped < safeTotal,
  };
}
