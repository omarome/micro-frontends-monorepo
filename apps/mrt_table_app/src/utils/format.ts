/** Format number as currency (USD) */
export const formatCurrency = (value: number | undefined | null): string => {
  if (value == null || Number.isNaN(value)) return '0';
  return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

/** Format ISO date string to locale date */
export const formatDate = (isoDate: string | undefined | null): string => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
};

/** Format ISO date to long locale (e.g. "January 15, 2025") */
export const formatDateLong = (isoDate: string | undefined | null): string => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
