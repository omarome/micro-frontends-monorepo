import React from 'react';
import { useTableLogic } from '../hooks/useTableLogic';
import { MobileCard } from './MobileCard';
import { TableHeaderCell } from './TableHeaderCell';
import { TableRow } from './TableRow';
import type { Invoice } from '../types';

const SORTABLE_FIELDS: (keyof Invoice)[] = [
  'invoiceNumber',
  'clientName',
  'amount',
  'status',
  'dueDate',
];

const TABLE_COLUMNS: { label: string; sortKey: keyof Invoice }[] = [
  { label: 'Invoice #', sortKey: 'invoiceNumber' },
  { label: 'Client', sortKey: 'clientName' },
  { label: 'Amount', sortKey: 'amount' },
  { label: 'Status', sortKey: 'status' },
  { label: 'Due Date', sortKey: 'dueDate' },
];

interface ResponsiveTableProps {
  data?: Invoice[];
  onRowClick?: (invoice: Invoice) => void;
  onMarkAsPaid?: (invoice: Invoice) => void;
  loading?: boolean;
  error?: string | null;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data = [],
  onRowClick,
  onMarkAsPaid,
}) => {
  const { sortedData, sortField, sortDirection, handleSort, isMobile } =
    useTableLogic<Invoice>(data, SORTABLE_FIELDS);

  const handleSortKey = (key: string) => handleSort(key as keyof Invoice);

  if (isMobile) {
    return (
      <div>
        {sortedData.map((row) => (
          <MobileCard
            key={row.id}
            row={row}
            onRowClick={onRowClick}
            onMarkAsPaid={onMarkAsPaid}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mfe-table-paper">
      <table className="mfe-table">
        <thead className="mfe-table-head">
          <tr>
            {TABLE_COLUMNS.map(({ label, sortKey }) => (
              <TableHeaderCell
                key={sortKey}
                label={label}
                sortKey={sortKey}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSortKey}
              />
            ))}
            <th className="mfe-table-head-cell">Actions</th>
          </tr>
        </thead>
        <tbody className="mfe-table-body">
          {sortedData.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              onRowClick={onRowClick}
              onMarkAsPaid={onMarkAsPaid}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;
