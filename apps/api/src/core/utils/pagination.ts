export function buildPage<TRow, TItem>(
  rows: TRow[],
  limit: number,
  toItem: (row: TRow) => TItem,
): { items: TItem[]; nextCursor: string | null } {
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const lastRow = page[page.length - 1] as (TRow & { id: string }) | undefined;
  return {
    items: page.map(toItem),
    nextCursor: hasMore && lastRow ? lastRow.id : null,
  };
}
