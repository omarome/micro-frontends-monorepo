import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar.js';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import React, { useRef, useState, useEffect } from 'react';
import '@ui-styles/shared-styles.css';
import './App.css';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [containerElement, setContainerElement] = useState(null);
  const [appLoaded, setAppLoaded] = useState(false);
  const bridgeService = useRef(null);

  const setContainerRef = (element) => {
    console.log('setContainerRef called with:', element);
    console.log('Element type:', typeof element);
    console.log('Element is null?', element === null);
    console.log('Element is HTMLElement?', element instanceof HTMLElement);
    setContainerElement(element);
  };

  useEffect(() => {
    if (!containerElement) {
      console.log('Container element not ready yet');
      return;
    }

    const loadInvoiceApp = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading Invoice App...');

        // Import the ReactBridgeService
        const { default: ReactBridgeService } = await import('./services/ReactBridgeService.js');
        bridgeService.current = ReactBridgeService;

        console.log('Container ready, loading Invoice App...');
        console.log('Container element:', containerElement);
        console.log('Container type:', typeof containerElement);

        // Use the bridge service to load the remote component
        await bridgeService.current.loadRemoteComponent(
          'invoice',
          './bootstrap',
          containerElement,
          {},
          'angular'
        );

        setLoading(false);
        setAppLoaded(true);
      } catch (err) {
        console.error('Failed to load Invoice App:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    // Start loading when container is available
    loadInvoiceApp();

    // Cleanup on unmount
    return () => {
      if (bridgeService.current && containerElement) {
        bridgeService.current.unmountComponent(containerElement);
      }
    };
  }, [containerElement]);

  if (loading) {
    return (
      <div className="mfe-container">
        <div className="mfe-loading" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div className="loading-spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p>Loading Invoice Management...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mfe-container">
        <div className="mfe-error" style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24'
        }}>
          <h3>Failed to load Invoice App</h3>
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('LegacyApp rendering, containerElement:', containerElement, 'appLoaded:', appLoaded);
  
  return (
    <div className="mfe-container">
      <div className="mfe-header" style={{
        textAlign: 'center',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h2 style={{ color: '#007bff', marginBottom: '10px', fontSize: '1.8em' }}>Invoice Management</h2>
        <p style={{ color: '#6c757d', fontSize: '1.1em', margin: '0' }}>AngularJS micro-frontend loaded via Module Federation Bridge</p>
      </div>
      <div className="mfe-content">
        {!containerElement && !appLoaded ? (
          <div className="mfe-loading" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div className="loading-spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <p>Initializing Invoice Management...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : null}
        <div ref={setContainerRef} style={{ minHeight: '600px' }} />
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
      <NavBar />
      <main className="main-content">
      <AnimatedRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;