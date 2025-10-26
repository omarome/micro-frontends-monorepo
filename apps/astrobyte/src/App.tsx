import React, { useEffect } from 'react';
import '@ui-styles/shared-styles.css';
import './styles.css';
import PaymentForm from './PaymentForm';

const App: React.FC = () => {
  useEffect(() => {
    // Listen for invoice:paid events from other MFEs
    const handleInvoicePaid = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('[PaymentMFE] Received invoice:paid event:', customEvent.detail);
    };

    window.addEventListener('invoice:paid', handleInvoicePaid as EventListener);

    return () => {
      window.removeEventListener('invoice:paid', handleInvoicePaid as EventListener);
    };
  }, []);

  return (
    <div className="payment-mfe-app">
      <PaymentForm />
    </div>
  );
};

export default App;