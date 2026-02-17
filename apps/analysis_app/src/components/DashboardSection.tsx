import React from 'react';

const REVENUE_BARS = ['60%', '80%', '45%', '90%', '75%', '95%'];

const ACTIVITY_ITEMS = [
  'Invoice created - 1,234',
  'Payment processed - 987',
  'Report generated - 456',
] as const;

interface DashboardSectionProps {
  onGenerateReport: () => void;
  onExportData: () => void;
  onRefreshStats: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  onGenerateReport,
  onExportData,
  onRefreshStats,
}) => (
  <section className="analysis-section analysis-section-full">
    <div className="analysis-section-header">
      <h2 className="analysis-section-title">📱 Dashboard</h2>
      <span className="analysis-badge">Interactive</span>
    </div>
    <div className="analysis-section-content">
      <div className="dashboard-grid">
        <div className="dashboard-widget">
          <h3 className="dashboard-widget-title">Revenue Trend</h3>
          <div className="dashboard-chart-placeholder">
            <div className="chart-bars">
              {REVENUE_BARS.map((height, i) => (
                <div key={i} className="chart-bar" style={{ height }} />
              ))}
            </div>
          </div>
        </div>
        <div className="dashboard-widget">
          <h3 className="dashboard-widget-title">User Activity</h3>
          <div className="dashboard-chart-placeholder">
            <div className="activity-timeline">
              {ACTIVITY_ITEMS.map((text, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-dot" />
                  <span className="activity-text">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="dashboard-widget">
          <h3 className="dashboard-widget-title">Quick Actions</h3>
          <div className="dashboard-actions">
            <button type="button" className="dashboard-action-btn" onClick={onGenerateReport}>
              Generate Report
            </button>
            <button type="button" className="dashboard-action-btn" onClick={onExportData}>
              Export Data
            </button>
            <button type="button" className="dashboard-action-btn" onClick={onRefreshStats}>
              Refresh Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
