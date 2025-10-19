import React, { useEffect, useRef } from 'react';
import angular from 'angular';
import '../../../libs/ui-styles/src/shared-styles.css';
import '../../../libs/ui-styles/src/invoice-styles.css';
// Import MVC components
import './components/invoice/index.js';

const LegacyAngularApp = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Bootstrap the AngularJS app with MVC components
      angular.bootstrap(containerRef.current, ['invoiceApp']);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        try {
          angular.element(containerRef.current).scope().$destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <div className="main-content">
      <div ref={containerRef} ng-app="invoiceApp">
        <invoice-component></invoice-component>
      </div>
    </div>
  );
};

export default LegacyAngularApp;