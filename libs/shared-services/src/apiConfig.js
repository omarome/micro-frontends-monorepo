/**
 * API Configuration Helper
 * Gets the API URL from window (for runtime testing) or defaults to localhost
 * 
 * Priority:
 * 1. window.REACT_APP_API_URL (for runtime testing in browser console)
 * 2. Default to localhost
 * 
 * Note: process.env is replaced by webpack at build time, but we check window first for runtime testing
 */

export function getApiUrl() {
  // Priority: window (runtime testing) > process.env (build-time) > default
  // Note: process.env.REACT_APP_API_URL is injected by webpack DefinePlugin at build time
  
  // Check window first (for runtime testing - can be set in browser console)
  if (typeof window !== 'undefined' && window.REACT_APP_API_URL) {
    return window.REACT_APP_API_URL;
  }
  
  // Check process.env (injected by webpack DefinePlugin at build time)
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:4000';
}

export default getApiUrl;

