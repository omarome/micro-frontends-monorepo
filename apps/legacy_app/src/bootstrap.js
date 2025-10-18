import React from 'react';
import { createRoot } from 'react-dom/client';
import LegacyAngularApp from './ReactWrapper.js';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LegacyAngularApp />);
