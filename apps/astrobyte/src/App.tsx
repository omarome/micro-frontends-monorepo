import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🚀 Astrobyte Micro-Frontend</h1>
      <p>This is the Astrobyte micro-frontend running on port 3003.</p>
      <div style={{ marginTop: '20px' }}>
        <h3>Features:</h3>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>Built with React + TypeScript</li>
          <li>Module Federation enabled</li>
          <li>Hot reloading support</li>
          <li>Shared UI components</li>
        </ul>
      </div>
    </div>
  );
};

export default App;