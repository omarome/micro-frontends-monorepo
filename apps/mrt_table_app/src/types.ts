/** Invoice entity from API */
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: string;
  dueDate: string;
  paidDate?: string;
  description?: string;
}

/** Theme change event detail from shell */
export interface ThemeChangeDetail {
  isDark: boolean;
}

/** CustomEvent for theme - use for addEventListener */
export interface ThemeChangeEvent extends Event {
  detail: ThemeChangeDetail;
}

declare global {
  interface Window {
    eventBus?: EventBus;
    REACT_APP_API_URL?: string;
  }
}

export interface EventBus {
  emit: (event: string, data: unknown) => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  off: (event: string, callback: (data: unknown) => void) => void;
}
