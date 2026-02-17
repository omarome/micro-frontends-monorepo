import { getStatusClass } from '../constants/status';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`mfe-chip ${getStatusClass(status)}`}>{status}</span>
);
