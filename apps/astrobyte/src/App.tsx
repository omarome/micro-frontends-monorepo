import React from 'react';
import '@ui-styles/shared-styles.css';

const App: React.FC = () => {
  return (
    <div className="main-content">
      <h1 className="home-title">🚀 Astrobyte Micro-Frontend</h1>
      <p className="home-subtitle">Modern React TypeScript application</p>
      <div className="intro-section">
        <div className="intro-icon">⚡</div>
        <p className="intro-text">Built with cutting-edge technologies</p>
        <div className="feature-highlights">
          <span className="feature-tag">⚛️ React + TypeScript</span>
          <span className="feature-tag">🔗 Module Federation</span>
          <span className="feature-tag">🔥 Hot Reloading</span>
          <span className="feature-tag">🎨 Shared Components</span>
        </div>
      </div>
    </div>
  );
};

export default App;