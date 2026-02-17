/** Map status value to chip CSS class (declarative, no switch) */
export const STATUS_MAP: Record<string, string> = {
  paid: 'mfe-chip-success',
  unpaid: 'mfe-chip-warning',
  overdue: 'mfe-chip-error',
};

export const getStatusClass = (status: string): string =>
  STATUS_MAP[status?.toLowerCase() ?? ''] ?? 'mfe-chip-default';
