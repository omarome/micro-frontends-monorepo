import React, { useState } from 'react';
import InvoiceSelector from './InvoiceSelector';
import { PaymentFormData, PaymentResult } from './types';

// Simple event bus for cross-MFE communication
const eventBus = {
  emit: (event: string, data: any) => {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
    console.log(`[PaymentMFE] Event emitted: ${event}`, data);
  }
};

const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    selectedInvoiceId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormData, string>>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger to refresh invoice list

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {};

    // Validate invoice selection
    if (!formData.selectedInvoiceId) {
      newErrors.selectedInvoiceId = 'Please select an invoice';
    }

    // Validate cardholder name
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    } else if (formData.cardholderName.trim().length < 3) {
      newErrors.cardholderName = 'Name must be at least 3 characters';
    }

    // Validate card number (mock validation - 16 digits)
    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardNumberClean)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    // Validate expiry date (MM/YY format)
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Format must be MM/YY';
    } else {
      // Check if not expired
      const [month, year] = formData.expiryDate.split('/').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Card is expired';
      }
    }

    // Validate CVV (3 digits)
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear result message when user starts editing
    if (result) {
      setResult(null);
    }
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 16);
    return limited.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      // Mock payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call backend to mark invoice as paid
      const response = await fetch(
        `http://localhost:4000/api/invoices/${formData.selectedInvoiceId}/paid`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment processing failed');
      }

      const data = await response.json();
      
      // Generate mock transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const successResult: PaymentResult = {
        success: true,
        message: 'Payment processed successfully!',
        invoiceId: formData.selectedInvoiceId,
        transactionId,
      };

      setResult(successResult);

      // Emit event for Invoice MFE to listen
      eventBus.emit('invoice:paid', {
        invoiceId: formData.selectedInvoiceId,
        transactionId,
        timestamp: new Date().toISOString(),
      });

      // Refresh the invoice list to remove the paid invoice
      setRefreshTrigger(prev => prev + 1);

      // Reset form after successful payment
      setTimeout(() => {
        setFormData({
          selectedInvoiceId: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardholderName: '',
        });
        setResult(null);
      }, 5000);

    } catch (error) {
      console.error('Payment error:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Payment failed. Please try again.',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-form-container">
      <div className="payment-form-card">
        <h2 className="payment-form-title">Process Payment</h2>
        <p className="payment-form-subtitle">Enter payment details to complete the transaction</p>

        <form onSubmit={handleSubmit} className="payment-form">
          {/* Invoice Selector */}
          <InvoiceSelector
            selectedInvoiceId={formData.selectedInvoiceId}
            onSelectInvoice={(id) => handleInputChange('selectedInvoiceId', id)}
            disabled={processing}
            refreshTrigger={refreshTrigger}
          />
          {errors.selectedInvoiceId && (
            <span className="error-text">{errors.selectedInvoiceId}</span>
          )}

          {/* Cardholder Name */}
          <div className="form-group">
            <label htmlFor="cardholderName" className="form-label">
              Cardholder Name *
            </label>
            <input
              type="text"
              id="cardholderName"
              value={formData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              placeholder="John Doe"
              disabled={processing}
              className="form-input"
              required
            />
            {errors.cardholderName && (
              <span className="error-text">{errors.cardholderName}</span>
            )}
          </div>

          {/* Card Number */}
          <div className="form-group">
            <label htmlFor="cardNumber" className="form-label">
              Card Number *
            </label>
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              disabled={processing}
              className="form-input"
              maxLength={19}
              required
            />
            {errors.cardNumber && (
              <span className="error-text">{errors.cardNumber}</span>
            )}
          </div>

          {/* Expiry Date and CVV */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate" className="form-label">
                Expiry Date *
              </label>
              <input
                type="text"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                disabled={processing}
                className="form-input"
                maxLength={5}
                required
              />
              {errors.expiryDate && (
                <span className="error-text">{errors.expiryDate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cvv" className="form-label">
                CVV *
              </label>
              <input
                type="text"
                id="cvv"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                disabled={processing}
                className="form-input"
                maxLength={4}
                required
              />
              {errors.cvv && (
                <span className="error-text">{errors.cvv}</span>
              )}
            </div>
          </div>

          {/* Result Message */}
          {result && (
            <div className={`result-message ${result.success ? 'success' : 'error'}`}>
              <span>{result.success ? '✅' : '❌'}</span>
              <div>
                <p><strong>{result.message}</strong></p>
                {result.success && result.transactionId && (
                  <p className="transaction-id">Transaction ID: {result.transactionId}</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className={`submit-button ${processing ? 'processing' : ''}`}
          >
            {processing ? (
              <>
                <span className="spinner"></span>
                Processing Payment...
              </>
            ) : (
              'Process Payment'
            )}
          </button>

          {/* Mock Notice */}
          <p className="mock-notice">
            ℹ️ This is a mock payment form. No actual charges will be made.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;

