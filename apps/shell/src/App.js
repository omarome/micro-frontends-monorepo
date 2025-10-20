import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar.js';
import Footer from './components/Footer.js';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import React, { useRef, useState, useEffect } from 'react';
import '@ui-styles/shared-styles.css';
import '@ui-styles/invoice-styles.css';
import '@ui-styles/shell-styles.css';

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
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading AstroByte...</div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <div className="error-title">Failed to load Astrobyte App</div>
            <div className="error-message">Error: {error.message}</div>
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
        console.log('Loading Legacy App module...');
        
        // Import the Module Federation remote
        const module = await import('legacy_app/InvoiceComponent');
        console.log('Legacy App module loaded:', module);
        console.log('Module keys:', Object.keys(module));
        console.log('Module.default:', module.default);
        console.log('Module.InvoiceComponent:', module.InvoiceComponent);
        
        // Handle the component
        if (module.default && typeof module.default === 'function') {
          console.log('Found Legacy App component at module.default');
          setComponent(() => module.default);
          setError(null);
        } else if (module.InvoiceComponent && typeof module.InvoiceComponent === 'function') {
          console.log('Found Legacy App component at module.InvoiceComponent');
          setComponent(() => module.InvoiceComponent);
          setError(null);
        } else if (module.LegacyAppWrapper && typeof module.LegacyAppWrapper === 'function') {
          console.log('Found Legacy App component at module.LegacyAppWrapper');
          setComponent(() => module.LegacyAppWrapper);
          setError(null);
        } else if (module.LegacyApp && typeof module.LegacyApp === 'function') {
          console.log('Found Legacy App component at module.LegacyApp');
          setComponent(() => module.LegacyApp);
          setError(null);
        } else {
          console.log('No valid component found in module');
          console.log('Available exports:', Object.keys(module));
          throw new Error('No valid component found in module');
        }
      } catch (err) {
        console.error('Failed to load Legacy App:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, []);

  if (loading) {
    return (
      <div className="mfe-container">
        <div className="mfe-loading">
          <div className="loading-spinner"></div>
          <p>Loading Invoice Management...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mfe-container">
        <div className="mfe-error">
          <h3>Failed to load Invoice App</h3>
          <p>Error: {error.message}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mfe-container">
      <div className="mfe-content">
        {Component ? <Component /> : <div>No component loaded</div>}
      </div>
    </div>
  );
};

const App3Component = () => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        console.log('Loading App3 module...');
        
        // Load the Module Federation remote
        console.log('Loading app3/App...');
        const module = await import('app3/App');
        console.log('Module loaded:', module);
        console.log('Module keys:', Object.keys(module));
        console.log('Module.default type:', typeof module.default);
        
        // Handle the App3 component (similar to Astrobyte structure)
        if (module.default && typeof module.default === 'function') {
          console.log('Found App3 component at module.default');
          setComponent(() => module.default);
          setError(null);
          return;
        } else if (module.default && module.default.default && typeof module.default.default === 'function') {
          console.log('Found App3 component at module.default.default');
          setComponent(() => module.default.default);
          setError(null);
          return;
        } else {
          console.log('No valid React component found in module');
          console.log('Available exports:', Object.keys(module));
          console.log('module.default:', module.default);
          console.log('Full module structure:', module);
        }
        
        throw new Error('No valid React component found in module');
      } catch (err) {
        console.error('Failed to load App3:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading App3...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <div className="error-title">Failed to load App3</div>
        <div className="error-message">Error: {error.message}</div>
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
                    <div className="home-container">
                      <h1 className="home-title">Welcome To Micro-Frontends World</h1>
                      <p className="home-subtitle">All frontend frameworks in one shell</p>
                      <div className="intro-section">
                        <div className="intro-icon">🎯</div>
                        <p className="intro-text">Explore modular applications working together seamlessly</p>
                        <div className="feature-highlights">
                          <span className="feature-tag">🔄 Independent Deployments</span>
                          <span className="feature-tag">⚡ Real-time Integration</span>
                          <span className="feature-tag">🎨 Modern UI/UX</span>
                        </div>
                      </div>
                      <div className="mfe-grid">
                        <div className="mfe-card">
                          <div className="mfe-card-icon">🏠</div>
                          <div className="mfe-card-title">Shell App</div>
                          <div className="mfe-card-description">Main orchestrator & navigation hub</div>
                        </div>
                        <div className="mfe-card">
                          <div className="mfe-card-icon">🎭</div>
                          <div className="mfe-card-title">Legacy App</div>
                          <div className="mfe-card-description">AngularJS with interactive jokes</div>
                        </div>
                        <div className="mfe-card">
                          <div className="mfe-card-icon">🚀</div>
                          <div className="mfe-card-title">AstroByte App</div>
                          <div className="mfe-card-description">Modern React TypeScript showcase</div>
                        </div>
                      </div>
                    </div>
                  }
                />
            <Route
              path="/invoice"
              element={<LegacyApp />}
            />
            <Route
              path="/astrobyte"
              element={<AstrobyteApp />}
            />
                <Route
                  path="/app3"
                  element={<App3Component />}
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
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;