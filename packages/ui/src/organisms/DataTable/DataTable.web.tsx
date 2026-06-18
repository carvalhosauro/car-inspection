import { Badge, type BadgeVariant } from "../../atoms/Badge";
import { IconButton } from "../../atoms/IconButton";
import { pageInfo, type Column, type DataTableProps } from "./DataTable.logic";
import styles from "./DataTable.module.css";

export function DataTable<T extends Record<string, unknown>>(props: DataTableProps<T>) {
  const { columns, rows, loading, emptyMessage, page = 1, totalPages = 1, onPrev, onNext, onView, onEdit } = props;
  const info = pageInfo(page, totalPages);

  const renderCell = (col: Column<T>, row: T) => {
    if (col.type === "status") {
      return <Badge variant={row[col.key] as BadgeVariant} />;
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
  };

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
        {loading ? (
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
                    {renderCell(col, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
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
