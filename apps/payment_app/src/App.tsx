import React, { useEffect } from 'react';
import '@ui-styles/shared-styles.css';
import '@ui-styles/payment-styles.css';
import PaymentForm from './PaymentForm';
import { initBackendMonitoring } from '../../../libs/shared-services/src/backendConnectionService.js';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize backend connection monitoring
    const backendService = initBackendMonitoring({
      baseUrl: 'http://localhost:4000',
      healthEndpoint: '/health',
      pollInterval: 5000
    });

    // Listen for invoice:paid events from other MFEs
    const handleInvoicePaid = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('[PaymentMFE] Received invoice:paid event:', customEvent.detail);
    };

    window.addEventListener('invoice:paid', handleInvoicePaid as EventListener);

    return () => {
      window.removeEventListener('invoice:paid', handleInvoicePaid as EventListener);
      backendService.stop();
    };
  }, []);

  return (
    <div className="payment-mfe-app">
      <PaymentForm />
    </div>
  );
};

export default App;