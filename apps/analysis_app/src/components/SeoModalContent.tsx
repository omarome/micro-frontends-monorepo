import React from 'react';

const SEO_FEATURES = [
  'Public analytics dashboard',
  'SEO-friendly content with meta tags',
  'Structured data for search engines',
  'Shareable statistics and insights',
] as const;

export const SeoModalContent: React.FC = () => (
  <div>
    <p>
      This is an SEO-optimized public page. In a production environment, this would display:
    </p>
    <ul>
      {SEO_FEATURES.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);
