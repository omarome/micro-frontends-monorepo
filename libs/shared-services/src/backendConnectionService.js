/**
 * Backend Connection Monitoring Service
 * 
 * Monitors backend availability and emits events when connection status changes.
 * All MFEs can listen to these events to automatically retry when backend comes back online.
 * 
 * Features:
 * - Health check polling with configurable interval
 * - Exponential backoff when backend is down
 * - Event emission for status changes
 * - Automatic start/stop based on app visibility
 * - Console logging for debugging
 */

class BackendConnectionService {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:4000';
    this.healthEndpoint = config.healthEndpoint || '/health';
    this.pollInterval = config.pollInterval || 5000; // 5 seconds default
    this.maxPollInterval = config.maxPollInterval || 30000; // 30 seconds max
    this.currentPollInterval = this.pollInterval;
    
    this.isConnected = null; // null = unknown, true = connected, false = disconnected
    this.isPolling = false;
    this.pollTimeout = null;
    this.listeners = {
      connected: [],
      disconnected: [],
      statusChange: []
    };
    
    console.log('[BackendConnectionService] Initialized', {
      baseUrl: this.baseUrl,
      healthEndpoint: this.healthEndpoint,
      pollInterval: this.pollInterval
    });
  }

  /**
   * Start monitoring backend connection
   */
  start() {
    if (this.isPolling) {
      console.log('[BackendConnectionService] Already polling, ignoring start request');
      return;
    }

    console.log('[BackendConnectionService] Starting backend monitoring...');
    this.isPolling = true;
    this.currentPollInterval = this.pollInterval;
    this.checkConnection();

    // Listen to page visibility to pause/resume polling
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Stop monitoring backend connection
   */
  stop() {
    console.log('[BackendConnectionService] Stopping backend monitoring...');
    this.isPolling = false;
    
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
      this.pollTimeout = null;
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Check backend connection health
   */
  async checkConnection() {
    if (!this.isPolling) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(`${this.baseUrl}${this.healthEndpoint}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      const wasConnected = this.isConnected;
      this.isConnected = response.ok;

      if (this.isConnected) {
        // Reset poll interval on successful connection
        this.currentPollInterval = this.pollInterval;

        // If backend just came back online
        if (wasConnected === false) {
          console.log('[BackendConnectionService] ✅ Backend is ONLINE');
          this.emit('connected', { timestamp: new Date().toISOString() });
          this.emit('statusChange', { 
            status: 'connected', 
            timestamp: new Date().toISOString() 
          });
        } else if (wasConnected === null) {
          console.log('[BackendConnectionService] ✅ Backend is ONLINE (initial check)');
        }
      } else {
        // Backend responded but with error status
        this.handleDisconnection(wasConnected, new Error(`HTTP ${response.status}: ${response.statusText}`));
      }
    } catch (error) {
      const wasConnected = this.isConnected;
      this.isConnected = false;
      this.handleDisconnection(wasConnected, error);
    }

    // Schedule next check (exponential backoff if disconnected)
    if (this.isPolling) {
      this.pollTimeout = setTimeout(
        () => this.checkConnection(),
        this.currentPollInterval
      );
    }
  }

  /**
   * Handle backend disconnection
   */
  handleDisconnection(wasConnected, error = null) {
    // If backend just went offline
    if (wasConnected === true) {
      console.log('[BackendConnectionService] ❌ Backend is OFFLINE', error?.message || '');
      this.emit('disconnected', { 
        timestamp: new Date().toISOString(),
        error: error?.message 
      });
      this.emit('statusChange', { 
        status: 'disconnected', 
        timestamp: new Date().toISOString() 
      });
    } else if (wasConnected === null) {
      console.log('[BackendConnectionService] ❌ Backend is OFFLINE (initial check)', error?.message || '');
    }

    // Exponential backoff - increase poll interval when backend is down
    this.currentPollInterval = Math.min(
      this.currentPollInterval * 1.5,
      this.maxPollInterval
    );
    
    console.log('[BackendConnectionService] Next check in', Math.round(this.currentPollInterval / 1000), 'seconds');
  }

  /**
   * Handle page visibility change
   */
  handleVisibilityChange = () => {
    if (document.hidden) {
      console.log('[BackendConnectionService] Page hidden, pausing monitoring');
      if (this.pollTimeout) {
        clearTimeout(this.pollTimeout);
        this.pollTimeout = null;
      }
    } else {
      console.log('[BackendConnectionService] Page visible, resuming monitoring');
      if (this.isPolling && !this.pollTimeout) {
        this.checkConnection();
      }
    }
  };

  /**
   * Add event listener
   * @param {string} event - 'connected', 'disconnected', or 'statusChange'
   * @param {function} callback - Callback function
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
      console.log(`[BackendConnectionService] Listener added for '${event}' event`);
    } else {
      console.warn(`[BackendConnectionService] Unknown event: ${event}`);
    }
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {function} callback - Callback function to remove
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      console.log(`[BackendConnectionService] Listener removed for '${event}' event`);
    }
  }

  /**
   * Emit event to all listeners
   * @param {string} event - Event name
   * @param {object} data - Event data
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[BackendConnectionService] Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * Get current connection status
   * @returns {boolean|null} true = connected, false = disconnected, null = unknown
   */
  getStatus() {
    return this.isConnected;
  }

  /**
   * Manually trigger a connection check (force immediate check)
   */
  forceCheck() {
    console.log('[BackendConnectionService] Force checking connection...');
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
      this.pollTimeout = null;
    }
    this.checkConnection();
  }
}

// Create singleton instance
let backendConnectionService = null;

/**
 * Get or create backend connection service instance
 * @param {object} config - Configuration options
 * @returns {BackendConnectionService} Singleton instance
 */
export function getBackendConnectionService(config = {}) {
  if (!backendConnectionService) {
    backendConnectionService = new BackendConnectionService(config);
  }
  return backendConnectionService;
}

/**
 * Initialize and start backend connection monitoring
 * @param {object} config - Configuration options
 * @returns {BackendConnectionService} Singleton instance
 */
export function initBackendMonitoring(config = {}) {
  const service = getBackendConnectionService(config);
  service.start();
  return service;
}

export default {
  getBackendConnectionService,
  initBackendMonitoring
};

