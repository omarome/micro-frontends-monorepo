import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="backend-error-container">
      <div className="backend-error-card">
        <div className="error-icon">⚠️</div>
        <div className="error-content">
          <h3 className="error-title">Unable to Load Data</h3>
          <p className="error-message">{error}</p>
          <div className="error-suggestions">
            <p><strong>Possible causes:</strong></p>
            <ul>
              <li>Backend server is not running (Port 4000)</li>
              <li>Network connectivity issues</li>
              <li>Database connection problems</li>
            </ul>
          </div>
          <button onClick={onRetry} className="retry-button">
            <span className="retry-icon">🔄</span>
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;

