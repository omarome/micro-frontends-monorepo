// TypeScript interfaces for Payment MFE

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentFormData {
  selectedInvoiceId: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface PaymentResult {
  success: boolean;
  message: string;
  invoiceId?: string;
  transactionId?: string;
}

