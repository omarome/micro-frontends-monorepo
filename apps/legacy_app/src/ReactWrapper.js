import React, { useEffect, useRef } from 'react';
import angular from 'angular';
import './app.js';

const LegacyAngularApp = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Bootstrap the AngularJS app
      angular.bootstrap(containerRef.current, ['legacyApp']);
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
    <div style={{ padding: '20px' }}>
      <div ref={containerRef} ng-app="legacyApp">
        <div ng-controller="MainCtrl">
          <h1>🎭 Legacy AngularJS App</h1>
          <p>This is a legacy AngularJS application running on port 3002.</p>
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#756D57', borderRadius: '8px' }}>
            <h3>Random Joke:</h3>
            <p style={{ fontSize: '16px', fontStyle: 'italic' }} ng-bind="joke"></p>
            <button 
              onClick={() => {
                // Trigger AngularJS digest cycle
                try {
                  console.log('Container ref:', containerRef.current);
                  console.log('Container HTML:', containerRef.current?.innerHTML);
                  
                  // First, let's try to find any element with ng-controller
                  const allElements = containerRef.current?.querySelectorAll('[ng-controller]');
                  console.log('All elements with ng-controller:', allElements);
                  
                  // Also try to find the specific controller element
                  const controllerElement = containerRef.current?.querySelector('[ng-controller="MainCtrl"]');
                  console.log('Controller element found:', controllerElement);
                  
                  if (controllerElement) {
                    const scope = angular.element(controllerElement).scope();
                    console.log('Controller scope found:', scope);
                    console.log('Controller scope functions:', Object.getOwnPropertyNames(scope));
                    
                    if (scope && scope.nextJoke) {
                      scope.$apply(() => {
                        scope.nextJoke();
                      });
                      console.log('nextJoke called successfully');
                    } else {
                      console.error('nextJoke function not found in controller scope');
                    }
                  } else {
                    // If controller element not found, try to find any scope with nextJoke
                    console.log('Controller element not found, searching all scopes...');
                    
                    const allScopes = [];
                    const findAllScopes = (element) => {
                      const elem = angular.element(element);
                      const elemScope = elem.scope();
                      if (elemScope) {
                        allScopes.push({ element: element, scope: elemScope });
                        console.log('Found scope on element:', element, 'scope:', elemScope);
                      }
                      elem.children().each((i, child) => {
                        findAllScopes(child);
                      });
                    };
                    
                    findAllScopes(containerRef.current);
                    console.log('All scopes found:', allScopes);
                    
                    // Look for a scope that has nextJoke function
                    const targetScope = allScopes.find(s => s.scope && s.scope.nextJoke);
                    if (targetScope) {
                      console.log('Found scope with nextJoke:', targetScope.scope);
                      targetScope.scope.$apply(() => {
                        targetScope.scope.nextJoke();
                      });
                    } else {
                      console.error('nextJoke function not found in any scope');
                      console.log('Available scopes:', allScopes.map(s => ({ 
                        element: s.element.tagName, 
                        scopeProps: Object.getOwnPropertyNames(s.scope).filter(prop => !prop.startsWith('$$') && !prop.startsWith('$'))
                      })));
                    }
                  }
                } catch (error) {
                  console.error('Error accessing scope:', error);
                }
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Next Joke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ensure proper export for Module Federation
export default LegacyAngularApp;
export { LegacyAngularApp };