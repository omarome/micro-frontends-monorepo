import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar.js';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import React, { useRef, useState, useEffect } from 'react';
import '@ui-styles/shared-styles.css';

// Direct Module Federation loading without React.lazy
const AstrobyteApp = () => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        console.log('Loading Astrobyte module...');
        
        // Import the Module Federation remote
        const module = await import('astrobyte/App');
        console.log('Astrobyte module loaded:', module);
        console.log('Module keys:', Object.keys(module));
        console.log('Module.default type:', typeof module.default);
        
        // Handle Module Federation factory function
        let component = null;
        
        // Log the entire module structure for debugging
        console.log('Full module structure:', module);
        console.log('Module.default:', module.default);
        console.log('Type of module.default:', typeof module.default);
        
        // Check if module.default is a factory function (common in Module Federation)
        if (module.default && typeof module.default === 'function') {
          try {
            // Call the factory function to get the actual module
            const factoryResult = module.default();
            console.log('Factory result:', factoryResult);
            console.log('Factory result type:', typeof factoryResult);
            
            if (factoryResult && typeof factoryResult === 'object' && factoryResult.default) {
              component = factoryResult.default;
              console.log('Found component at factoryResult.default');
            } else if (factoryResult && typeof factoryResult === 'function') {
              component = factoryResult;
              console.log('Found component as factoryResult (function)');
            } else {
              console.log('Factory result is not a valid component');
            }
          } catch (error) {
            console.error('Error calling factory function:', error);
            // Fallback to treating module.default as the component directly
            component = module.default;
            console.log('Using module.default as component (fallback)');
          }
        } else if (module.default && typeof module.default === 'object') {
          // Direct module object
          if (module.default.default && typeof module.default.default === 'function') {
            component = module.default.default;
            console.log('Found component at module.default.default');
          } else {
            // Search for any function in the object
            const keys = Object.keys(module.default);
            for (const key of keys) {
              if (typeof module.default[key] === 'function') {
                component = module.default[key];
                console.log(`Found component at module.default.${key}`);
                break;
              }
            }
          }
        } else if (module.App && typeof module.App === 'function') {
          component = module.App;
          console.log('Found component at module.App');
        } else {
          // Try to get the first exported component
          const exports = Object.keys(module);
          console.log('Available exports:', exports);
          for (const exportName of exports) {
            const exportValue = module[exportName];
            console.log(`Export ${exportName}:`, exportValue, typeof exportValue);
            if (typeof exportValue === 'function') {
              component = exportValue;
              console.log(`Using export ${exportName} as component`);
              break;
            } else if (typeof exportValue === 'object' && exportValue.default && typeof exportValue.default === 'function') {
              component = exportValue.default;
              console.log(`Using export ${exportName}.default as component`);
              break;
            }
          }
        }
        
        console.log('Final component:', component);
        console.log('Component type:', typeof component);
        if (component && typeof component === 'function') {
          setComponent(() => component);
          setError(null);
        } else {
          console.log('Component validation failed:', { component, type: typeof component });
          throw new Error('No valid React component found in module');
        }
      } catch (err) {
        console.error('Failed to load Astrobyte:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Loading AstroByte...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Failed to load Astrobyte App</h2>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return Component ? <Component /> : <div>No component loaded</div>;
};

const LegacyApp = () => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        console.log('Loading Legacy module...');
        
        // Load the Module Federation remote
        console.log('Loading legacyApp/App...');
        const module = await import('legacyApp/App');
        console.log('Module loaded:', module);
        console.log('Module keys:', Object.keys(module));
        console.log('Module.default type:', typeof module.default);
        
        // The module is not a factory function, it's the actual module
        if (module.default && typeof module.default === 'function') {
          console.log('Found LegacyAngularApp component at module.default');
          setComponent(() => module.default);
          setError(null);
          return;
        } else if (module.LegacyAngularApp && typeof module.LegacyAngularApp === 'function') {
          console.log('Found LegacyAngularApp component at module.LegacyAngularApp');
          setComponent(() => module.LegacyAngularApp);
          setError(null);
          return;
        } else {
          console.log('No valid React component found in module');
          console.log('Available exports:', Object.keys(module));
          console.log('module.default:', module.default);
          console.log('module.LegacyAngularApp:', module.LegacyAngularApp);
        }
        
        throw new Error('No valid React component found in module');
      } catch (err) {
        console.error('Failed to load Legacy:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Loading Legacy App...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Failed to load Legacy App</h2>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return Component ? <Component /> : <div>No component loaded</div>;
};

function AnimatedRoutes() {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={location.pathname}
        classNames="tab-content-fade"
        timeout={400}
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div ref={nodeRef}>
          <Routes location={location}>
            <Route 
              path="/" 
              element={
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h1>Welcome to the Micro-Frontend Shell</h1>
                  <p>Navigate to different micro-frontends using the navigation above.</p>
                </div>
              } 
            />
            <Route
              path="/legacy"
              element={<LegacyApp />}
            />
            <Route
              path="/astrobyte"
              element={<AstrobyteApp />}
            />
            <Route 
              path="/app3" 
              element={
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h2>App 3</h2>
                  <p>Coming soon...</p>
                </div>
              } 
            />
          </Routes>
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;