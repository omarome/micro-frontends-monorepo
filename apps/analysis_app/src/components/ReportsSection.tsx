import React from 'react';

const REPORTS = [
  {
    icon: '📈',
    title: 'Monthly Revenue Report',
    description: 'Generated on server - SEO optimized',
    meta: 'Last updated: 2 hours ago',
  },
  {
    icon: '📊',
    title: 'User Analytics Report',
    description: 'Server-side rendered for performance',
    meta: 'Last updated: 5 hours ago',
  },
  {
    icon: '💳',
    title: 'Payment Processing Report',
    description: 'SSR with real-time data sync',
    meta: 'Last updated: 1 hour ago',
  },
] as const;

interface ReportsSectionProps {
  onViewReport: (name: string) => void;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({ onViewReport }) => (
  <section className="analysis-section analysis-section-full">
    <div className="analysis-section-header">
      <h2 className="analysis-section-title">📋 SSR Reports</h2>
      <span className="analysis-badge">Server-Side</span>
    </div>
    <div className="analysis-section-content">
      <div className="reports-list">
        {REPORTS.map((report) => (
          <div key={report.title} className="report-item">
            <div className="report-icon">{report.icon}</div>
            <div className="report-details">
              <h3 className="report-title">{report.title}</h3>
              <p className="report-description">{report.description}</p>
              <span className="report-meta">{report.meta}</span>
            </div>
            <button
              type="button"
              className="report-action-btn"
              onClick={() => onViewReport(report.title)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);
