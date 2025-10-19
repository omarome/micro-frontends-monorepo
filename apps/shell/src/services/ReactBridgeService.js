import React from 'react';
import { createRoot } from 'react-dom/client';

class ReactBridgeService {
  constructor() {
    this.mountedComponents = new Map();
    this.angularInstances = new Map();
  }

  /**
   * Mount a React component into a DOM container
   * @param {HTMLElement} container - DOM element to mount into
   * @param {React.Component} Component - React component to mount
   * @param {Object} props - Props to pass to the component
   * @param {string} id - Unique identifier for this mount
   */
  async mountReactComponent(container, Component, props = {}, id = null) {
    try {
      // Clean up any existing component in this container
      this.unmountComponent(container);
      
      // Create React root and render
      const root = createRoot(container);
      root.render(React.createElement(Component, props));
      
      // Store reference for cleanup
      const mountId = id || `react-${Date.now()}`;
      this.mountedComponents.set(mountId, { root, container });
      
      return mountId;
    } catch (error) {
      console.error('Error mounting React component:', error);
      throw error;
    }
  }

  /**
   * Mount an AngularJS component into a DOM container
   * @param {HTMLElement} container - DOM element to mount into
   * @param {Object} componentConfig - AngularJS component configuration
   * @param {string} id - Unique identifier for this mount
   */
  async mountAngularComponent(container, componentConfig, id = null) {
    try {
      // Clean up any existing component in this container
      this.unmountComponent(container);
      
      // Clear container
      container.innerHTML = '';
      
      // Dynamically import AngularJS
      const angular = await import('angular');
      
      // Create a new AngularJS module for this component
      const moduleName = `invoiceApp_${Date.now()}`;
      const app = angular.module(moduleName, []);
      
      // Register the component
      if (componentConfig.component) {
        app.component(componentConfig.component.name, componentConfig.component.config);
      }
      
      if (componentConfig.controller) {
        app.controller(componentConfig.controller.name, componentConfig.controller.fn);
      }
      
      // Bootstrap the AngularJS app
      angular.bootstrap(container, [moduleName]);
      
      // Store reference for cleanup
      const mountId = id || `angular-${Date.now()}`;
      this.angularInstances.set(mountId, { 
        container, 
        moduleName, 
        angular: angular.default || angular 
      });
      
      return mountId;
    } catch (error) {
      console.error('Error mounting AngularJS component:', error);
      throw error;
    }
  }

  /**
   * Load and mount a remote component using Module Federation
   * @param {string} remoteName - Name of the remote (e.g., 'invoice')
   * @param {string} exposedModule - Path to the exposed module (e.g., './bootstrap')
   * @param {HTMLElement} container - DOM element to mount into
   * @param {Object} props - Props to pass to the component
   * @param {string} framework - 'react' or 'angular'
   */
  async loadRemoteComponent(remoteName, exposedModule, container, props = {}, framework = 'react') {
    try {
      console.log(`Loading ${framework} component from ${remoteName}${exposedModule}`);
      
      if (framework === 'angular') {
        // For AngularJS, load the bootstrap from the remote
        return await this.loadAngularBootstrap(remoteName, exposedModule, container, props);
      } else {
        // Dynamically import the remote component
        const module = await import(`${remoteName}${exposedModule}`);
        console.log('Remote module loaded:', module);
        
        const Component = module.default || module[Object.keys(module)[0]];
        return await this.mountReactComponent(container, Component, props);
      }
    } catch (error) {
      console.error(`Error loading remote ${framework} component:`, error);
      throw error;
    }
  }

  /**
   * Load AngularJS bootstrap from remote MFE
   * @param {string} remoteName - Name of the remote
   * @param {string} exposedModule - Path to the exposed module
   * @param {HTMLElement} container - DOM element to mount into
   * @param {Object} props - Props to pass to the component
   */
  async loadAngularBootstrap(remoteName, exposedModule, container, props = {}) {
    try {
      console.log(`Loading AngularJS bootstrap from ${remoteName}${exposedModule}`);
      
      // Load the remote script
      await this.loadScript(`http://localhost:3001/main.bundle.js`);
      
      // Wait for the global InvoiceBootstrap to be available
      let attempts = 0;
      while (!window.InvoiceBootstrap && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!window.InvoiceBootstrap) {
        throw new Error('InvoiceBootstrap not available after loading script');
      }

      console.log('InvoiceBootstrap loaded:', window.InvoiceBootstrap);
      console.log('Container element:', container);
      console.log('Container type:', typeof container);
      console.log('Container is null?', container === null);
      console.log('Container is HTMLElement?', container instanceof HTMLElement);

      if (!container) {
        throw new Error('Container element is null or undefined');
      }

      if (!(container instanceof HTMLElement)) {
        throw new Error('Container is not a valid HTMLElement');
      }

      // Initialize the AngularJS app
      await window.InvoiceBootstrap.init(container);
      
      // Store reference for cleanup
      const mountId = `angular-bootstrap-${Date.now()}`;
      this.angularInstances.set(mountId, { container, bootstrap: window.InvoiceBootstrap });
      
      return mountId;
    } catch (error) {
      console.error('Error loading AngularJS bootstrap:', error);
      throw error;
    }
  }

  /**
   * Load script dynamically
   * @param {string} src - Script source URL
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Load AngularJS invoice app directly from remote URL
   * @param {HTMLElement} container - DOM element to mount into
   * @param {Object} props - Props to pass to the component
   */
  async loadAngularInvoiceApp(container, props = {}) {
    try {
      console.log('Loading AngularJS invoice app...');
      console.log('Container:', container);
      
      if (!container) {
        throw new Error('Container element is null or undefined');
      }
      
      // Clean up any existing component in this container
      this.unmountComponent(container);
      
      // Clear container
      container.innerHTML = '';
      
      // Create iframe to load the AngularJS app
      const iframe = document.createElement('iframe');
      iframe.src = 'http://localhost:3001';
      iframe.style.width = '100%';
      iframe.style.height = '800px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      
      container.appendChild(iframe);
      
      // Store reference for cleanup
      const mountId = `angular-iframe-${Date.now()}`;
      this.angularInstances.set(mountId, { container, iframe });
      
      console.log('AngularJS invoice app loaded successfully');
      return mountId;
    } catch (error) {
      console.error('Error loading AngularJS invoice app:', error);
      throw error;
    }
  }

  /**
   * Unmount a component from its container
   * @param {HTMLElement|string} containerOrId - Container element or mount ID
   */
  unmountComponent(containerOrId) {
    try {
      // If it's a string, it's an ID
      if (typeof containerOrId === 'string') {
        const reactMount = this.mountedComponents.get(containerOrId);
        if (reactMount) {
          reactMount.root.unmount();
          this.mountedComponents.delete(containerOrId);
          return;
        }
        
        const angularMount = this.angularInstances.get(containerOrId);
        if (angularMount) {
          angularMount.container.innerHTML = '';
          this.angularInstances.delete(containerOrId);
          return;
        }
      } else {
        // It's a container element, find and unmount
        for (const [id, mount] of this.mountedComponents.entries()) {
          if (mount.container === containerOrId) {
            mount.root.unmount();
            this.mountedComponents.delete(id);
            break;
          }
        }
        
        for (const [id, mount] of this.angularInstances.entries()) {
          if (mount.container === containerOrId) {
            mount.container.innerHTML = '';
            this.angularInstances.delete(id);
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error unmounting component:', error);
    }
  }

  /**
   * Unmount all components
   */
  unmountAll() {
    this.mountedComponents.forEach((mount) => {
      try {
        mount.root.unmount();
      } catch (error) {
        console.error('Error unmounting React component:', error);
      }
    });
    
    this.angularInstances.forEach((mount) => {
      try {
        mount.container.innerHTML = '';
      } catch (error) {
        console.error('Error unmounting AngularJS component:', error);
      }
    });
    
    this.mountedComponents.clear();
    this.angularInstances.clear();
  }

  /**
   * Get mounted component info
   */
  getMountedComponents() {
    return {
      react: Array.from(this.mountedComponents.keys()),
      angular: Array.from(this.angularInstances.keys())
    };
  }
}

// Create singleton instance
const bridgeService = new ReactBridgeService();

export default bridgeService;
