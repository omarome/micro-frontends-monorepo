import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Only render if running standalone (not as a module federation remote)
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}