import React, { useState, useEffect } from 'react';
import '@ui-styles/shared-styles.css';
import '@ui-styles/analysis-styles.css';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedSeoPage, setSelectedSeoPage] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      setIsDarkMode(initialTheme === 'dark');
    } catch (error) {
      console.error('Error initializing theme:', error);
    }
  }, []);

  // Listen to theme changes from shell app
  useEffect(() => {
    const handleThemeChange = (event: any) => {
      const { isDark } = event.detail;
      setIsDarkMode(isDark);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  // Handle report view
  const handleViewReport = (reportName: string) => {
    setSelectedReport(reportName);
    console.log(`Viewing report: ${reportName}`);
    // In a real app, this would navigate to the report page or open a modal
    setTimeout(() => {
      setSelectedReport(null);
    }, 3000);
  };

  // Handle SEO page view
  const handleViewSeoPage = (pageName: string) => {
    setSelectedSeoPage(pageName);
    console.log(`Viewing SEO page: ${pageName}`);
    // In a real app, this would navigate to the SEO page
    setTimeout(() => {
      setSelectedSeoPage(null);
    }, 3000);
  };

  // Handle dashboard actions
  const handleGenerateReport = () => {
    setNotification('Generating report... This may take a few moments.');
    console.log('Generating report...');
    setTimeout(() => {
      setNotification('Report generated successfully!');
      setTimeout(() => setNotification(null), 3000);
    }, 2000);
  };

  const handleExportData = () => {
    setNotification('Exporting data...');
    console.log('Exporting data...');
    setTimeout(() => {
      setNotification('Data exported successfully!');
      setTimeout(() => setNotification(null), 3000);
    }, 1500);
  };

  const handleRefreshStats = () => {
    setNotification('Refreshing statistics...');
    console.log('Refreshing stats...');
    setTimeout(() => {
      setNotification('Statistics refreshed!');
      setTimeout(() => setNotification(null), 3000);
    }, 1000);
  };

  return (
    <div className="analysis-app-container" data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="analysis-header">
        <h1 className="analysis-title">📈 Analysis Dashboard</h1>
        <p className="analysis-subtitle">Comprehensive analytics and reporting</p>
      </div>

      <div className="analysis-grid">
        {/* Dashboard Section */}
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
                    <div className="chart-bar" style={{ height: '60%' }}></div>
                    <div className="chart-bar" style={{ height: '80%' }}></div>
                    <div className="chart-bar" style={{ height: '45%' }}></div>
                    <div className="chart-bar" style={{ height: '90%' }}></div>
                    <div className="chart-bar" style={{ height: '75%' }}></div>
                    <div className="chart-bar" style={{ height: '95%' }}></div>
                  </div>
                </div>
              </div>
              <div className="dashboard-widget">
                <h3 className="dashboard-widget-title">User Activity</h3>
                <div className="dashboard-chart-placeholder">
                  <div className="activity-timeline">
                    <div className="activity-item">
                      <span className="activity-dot"></span>
                      <span className="activity-text">Invoice created - 1,234</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-dot"></span>
                      <span className="activity-text">Payment processed - 987</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-dot"></span>
                      <span className="activity-text">Report generated - 456</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-widget">
                <h3 className="dashboard-widget-title">Quick Actions</h3>
                <div className="dashboard-actions">
                  <button 
                    className="dashboard-action-btn"
                    onClick={handleGenerateReport}
                  >
                    Generate Report
                  </button>
                  <button 
                    className="dashboard-action-btn"
                    onClick={handleExportData}
                  >
                    Export Data
                  </button>
                  <button 
                    className="dashboard-action-btn"
                    onClick={handleRefreshStats}
                  >
                    Refresh Stats
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Public Stats Section */}
        <section className="analysis-section analysis-section-full">
          <div className="analysis-section-header">
            <h2 className="analysis-section-title">📊 Public Stats</h2>
            <span className="analysis-badge">Live</span>
          </div>
          <div className="analysis-section-content">
            <div className="stats-list">
              <div className="stat-item">
                <div className="stat-item-icon">👥</div>
                <div className="stat-item-details">
                  <h3 className="stat-item-title">Total Users</h3>
                  <p className="stat-item-value">12,450</p>
                  <span className="stat-item-change positive">+12.5%</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-item-icon">📄</div>
                <div className="stat-item-details">
                  <h3 className="stat-item-title">Total Invoices</h3>
                  <p className="stat-item-value">3,892</p>
                  <span className="stat-item-change positive">+8.2%</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-item-icon">💰</div>
                <div className="stat-item-details">
                  <h3 className="stat-item-title">Revenue</h3>
                  <p className="stat-item-value">$2.4M</p>
                  <span className="stat-item-change positive">+15.3%</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-item-icon">✅</div>
                <div className="stat-item-details">
                  <h3 className="stat-item-title">Payment Rate</h3>
                  <p className="stat-item-value">87%</p>
                  <span className="stat-item-change positive">+3.1%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SSR Reports Section */}
        <section className="analysis-section analysis-section-full">
          <div className="analysis-section-header">
            <h2 className="analysis-section-title">📋 SSR Reports</h2>
            <span className="analysis-badge">Server-Side</span>
          </div>
          <div className="analysis-section-content">
            <div className="reports-list">
              <div className="report-item">
                <div className="report-icon">📈</div>
                <div className="report-details">
                  <h3 className="report-title">Monthly Revenue Report</h3>
                  <p className="report-description">Generated on server - SEO optimized</p>
                  <span className="report-meta">Last updated: 2 hours ago</span>
                </div>
                <button 
                  className="report-action-btn"
                  onClick={() => handleViewReport('Monthly Revenue Report')}
                >
                  View
                </button>
              </div>
              <div className="report-item">
                <div className="report-icon">📊</div>
                <div className="report-details">
                  <h3 className="report-title">User Analytics Report</h3>
                  <p className="report-description">Server-side rendered for performance</p>
                  <span className="report-meta">Last updated: 5 hours ago</span>
                </div>
                <button 
                  className="report-action-btn"
                  onClick={() => handleViewReport('User Analytics Report')}
                >
                  View
                </button>
              </div>
              <div className="report-item">
                <div className="report-icon">💳</div>
                <div className="report-details">
                  <h3 className="report-title">Payment Processing Report</h3>
                  <p className="report-description">SSR with real-time data sync</p>
                  <span className="report-meta">Last updated: 1 hour ago</span>
                </div>
                <button 
                  className="report-action-btn"
                  onClick={() => handleViewReport('Payment Processing Report')}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Pages Section */}
        <section className="analysis-section analysis-section-full">
          <div className="analysis-section-header">
            <h2 className="analysis-section-title">🔍 SEO Pages</h2>
            <span className="analysis-badge">Optimized</span>
          </div>
          <div className="analysis-section-content">
            <div className="seo-pages-list">
              <div className="seo-page-item">
                <div className="seo-page-icon">📄</div>
                <div className="seo-page-details">
                  <h3 className="seo-page-title">Invoice Analytics</h3>
                  <p className="seo-page-description">Public-facing analytics page with SEO optimization</p>
                  <div className="seo-page-meta">
                    <span className="seo-meta-item">Score: 95/100</span>
                    <span className="seo-meta-item">Indexed: ✅</span>
                  </div>
                </div>
                <button 
                  className="seo-page-action-btn"
                  onClick={() => handleViewSeoPage('Invoice Analytics')}
                >
                  View
                </button>
              </div>
              <div className="seo-page-item">
                <div className="seo-page-icon">📊</div>
                <div className="seo-page-details">
                  <h3 className="seo-page-title">Revenue Statistics</h3>
                  <p className="seo-page-description">SEO-friendly revenue statistics page</p>
                  <div className="seo-page-meta">
                    <span className="seo-meta-item">Score: 92/100</span>
                    <span className="seo-meta-item">Indexed: ✅</span>
                  </div>
                </div>
                <button 
                  className="seo-page-action-btn"
                  onClick={() => handleViewSeoPage('Revenue Statistics')}
                >
                  View
                </button>
              </div>
              <div className="seo-page-item">
                <div className="seo-page-icon">📈</div>
                <div className="seo-page-details">
                  <h3 className="seo-page-title">Growth Metrics</h3>
                  <p className="seo-page-description">Public growth metrics with rich snippets</p>
                  <div className="seo-page-meta">
                    <span className="seo-meta-item">Score: 98/100</span>
                    <span className="seo-meta-item">Indexed: ✅</span>
                  </div>
                </div>
                <button 
                  className="seo-page-action-btn"
                  onClick={() => handleViewSeoPage('Growth Metrics')}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="analysis-notification">
          <div className="analysis-notification-content">
            <span className="analysis-notification-icon">ℹ️</span>
            <span className="analysis-notification-text">{notification}</span>
          </div>
        </div>
      )}

      {/* Report/SEO Page View Modal */}
      {(selectedReport || selectedSeoPage) && (
        <div className="analysis-modal-overlay" onClick={() => {
          setSelectedReport(null);
          setSelectedSeoPage(null);
        }}>
          <div className="analysis-modal" onClick={(e) => e.stopPropagation()}>
            <div className="analysis-modal-header">
              <h2 className="analysis-modal-title">
                {selectedReport || selectedSeoPage}
              </h2>
              <button 
                className="analysis-modal-close"
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedSeoPage(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="analysis-modal-content">
              {selectedReport && (
                <div>
                  <p>This is a server-side rendered report. In a production environment, this would display:</p>
                  <ul>
                    <li>Real-time data visualization</li>
                    <li>Interactive charts and graphs</li>
                    <li>Exportable data tables</li>
                    <li>Filtering and sorting options</li>
                  </ul>
                </div>
              )}
              {selectedSeoPage && (
                <div>
                  <p>This is an SEO-optimized public page. In a production environment, this would display:</p>
                  <ul>
                    <li>Public analytics dashboard</li>
                    <li>SEO-friendly content with meta tags</li>
                    <li>Structured data for search engines</li>
                    <li>Shareable statistics and insights</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="analysis-modal-actions">
              <button 
                className="analysis-modal-btn"
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedSeoPage(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
