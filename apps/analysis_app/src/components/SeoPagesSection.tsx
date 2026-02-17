import React from 'react';

const SEO_PAGES = [
  { icon: '📄', title: 'Invoice Analytics', description: 'Public-facing analytics page with SEO optimization', score: '95/100' },
  { icon: '📊', title: 'Revenue Statistics', description: 'SEO-friendly revenue statistics page', score: '92/100' },
  { icon: '📈', title: 'Growth Metrics', description: 'Public growth metrics with rich snippets', score: '98/100' },
] as const;

interface SeoPagesSectionProps {
  onViewSeoPage: (name: string) => void;
}

export const SeoPagesSection: React.FC<SeoPagesSectionProps> = ({ onViewSeoPage }) => (
  <section className="analysis-section analysis-section-full">
    <div className="analysis-section-header">
      <h2 className="analysis-section-title">🔍 SEO Pages</h2>
      <span className="analysis-badge">Optimized</span>
    </div>
    <div className="analysis-section-content">
      <div className="seo-pages-list">
        {SEO_PAGES.map((page) => (
          <div key={page.title} className="seo-page-item">
            <div className="seo-page-icon">{page.icon}</div>
            <div className="seo-page-details">
              <h3 className="seo-page-title">{page.title}</h3>
              <p className="seo-page-description">{page.description}</p>
              <div className="seo-page-meta">
                <span className="seo-meta-item">Score: {page.score}</span>
                <span className="seo-meta-item">Indexed: ✅</span>
              </div>
            </div>
            <button
              type="button"
              className="seo-page-action-btn"
              onClick={() => onViewSeoPage(page.title)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);
