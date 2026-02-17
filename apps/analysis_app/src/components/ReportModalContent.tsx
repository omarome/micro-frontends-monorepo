import React from 'react';

const REPORT_FEATURES = [
  'Real-time data visualization',
  'Interactive charts and graphs',
  'Exportable data tables',
  'Filtering and sorting options',
] as const;

export const ReportModalContent: React.FC = () => (
  <div>
    <p>
      This is a server-side rendered report. In a production environment, this would display:
    </p>
    <ul>
      {REPORT_FEATURES.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);
