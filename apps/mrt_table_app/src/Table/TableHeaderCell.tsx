import type { SortDirection } from '../hooks/useTableLogic';

interface TableHeaderCellProps {
  label: string;
  sortKey: string;
  sortField: string | null;
  sortDirection: SortDirection;
  onSort: (field: string) => void;
}

export const TableHeaderCell = ({
  label,
  sortKey,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderCellProps) => (
  <th className="mfe-table-head-cell" onClick={() => onSort(sortKey)}>
    <div className="mfe-table-head-cell-sortable">
      {label}
      {sortField === sortKey && (
        <span className={`mfe-table-sort-icon ${sortDirection}`}>
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </div>
  </th>
);
