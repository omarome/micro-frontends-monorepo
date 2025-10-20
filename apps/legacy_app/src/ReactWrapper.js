import React, { useEffect, useRef } from 'react';
import angular from 'angular';
import './app.js';
import './components/invoice/invoice.component.js';
import './components/invoice/invoice.model.js';
import './components/invoice/invoice.controller.js';

const LegacyAppWrapper = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      console.log('ReactWrapper: Setting up AngularJS app...');
      
      // Create a div for AngularJS to mount to
      const angularDiv = document.createElement('div');
      angularDiv.innerHTML = '<invoice-component></invoice-component>';
      containerRef.current.appendChild(angularDiv);

      console.log('ReactWrapper: AngularJS div created, bootstrapping...');
      
      try {
        // Bootstrap AngularJS
        angular.bootstrap(angularDiv, ['legacyApp']);
        console.log('ReactWrapper: AngularJS bootstrapped successfully');
      } catch (error) {
        console.error('ReactWrapper: AngularJS bootstrap failed:', error);
      }

      // Cleanup function
      return () => {
        if (angularDiv && angularDiv.parentNode) {
          angularDiv.parentNode.removeChild(angularDiv);
        }
      };
    }
  }, []);

  return <div ref={containerRef} />;
};

// Export for Module Federation
export default LegacyAppWrapper;
export { LegacyAppWrapper as InvoiceComponent };
export { LegacyAppWrapper as LegacyApp };