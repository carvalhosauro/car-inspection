import { Badge, type BadgeVariant } from "../../atoms/Badge";
import { IconButton } from "../../atoms/IconButton";
import { pageInfo, type Column, type DataTableProps } from "./DataTable.logic";
import styles from "./DataTable.module.css";

const BADGE_VARIANTS: readonly BadgeVariant[] = [
  "concluido",
  "em-andamento",
  "pendente",
  "reprovado",
  "agendado",
];

function isBadgeVariant(value: unknown): value is BadgeVariant {
  return typeof value === "string" && (BADGE_VARIANTS as string[]).includes(value);
}

function renderCell<T extends Record<string, unknown>>(
  col: Column<T>,
  row: T,
  onView?: (row: T) => void,
  onEdit?: (row: T) => void,
) {
  if (col.type === "status") {
    const rawValue = row[col.key];
    const badgeValue = isBadgeVariant(rawValue) ? rawValue : "pendente";
    return <Badge variant={badgeValue} />;
  }
  if (col.type === "actions") {
    return (
      <span className={styles.actions}>
        <IconButton icon="arrow-right" ariaLabel="Visualizar" ghost onPress={() => onView?.(row)} />
        <IconButton icon="edit" ariaLabel="Editar" ghost onPress={() => onEdit?.(row)} />
      </span>
    );
  }
  return <>{String(row[col.key] ?? "")}</>;
}

export function DataTable<T extends Record<string, unknown>>(props: DataTableProps<T>) {
  const { columns, rows, loading, emptyMessage, page = 1, totalPages = 1, onPrev, onNext, onView, onEdit } = props;
  const info = pageInfo(page, totalPages);

  const tbodyContent = loading ? (
    <tbody>
      {[0, 1, 2].map((i) => (
        <tr key={i} className={styles.skeletonRow}>
          {columns.map((col) => (
            <td key={col.key} className={styles.skeletonCell}>
              <span className={styles.shimmer} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  ) : rows.length === 0 ? (
    <tbody>
      <tr>
        <td colSpan={columns.length} className={styles.emptyCell}>
          {emptyMessage ?? "Nenhum registro encontrado"}
        </td>
      </tr>
    </tbody>
  ) : (
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex} className={styles.row}>
          {columns.map((col, colIndex) => (
            <td key={`${col.key}-${colIndex}`} className={styles.td}>
              {renderCell(col, row, onView, onEdit)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className={styles.wrapper}>
      <table className={styles.table} aria-busy={loading}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={`${col.key}-${i}`} className={styles.th} scope="col">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        {tbodyContent}
      </table>
      <div className={styles.pagination}>
        <span>
          Página {info.page} de {info.totalPages}
        </span>
        <button
          type="button"
          className={styles.pageButton}
          disabled={!info.canPrev}
          onClick={onPrev}
        >
          Anterior
        </button>
        <button
          type="button"
          className={styles.pageButton}
          disabled={!info.canNext}
          onClick={onNext}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
