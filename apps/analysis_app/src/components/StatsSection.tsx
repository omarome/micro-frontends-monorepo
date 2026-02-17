import React from 'react';

const STAT_ITEMS = [
  { icon: '👥', title: 'Total Users', value: '12,450', change: '+12.5%' },
  { icon: '📄', title: 'Total Invoices', value: '3,892', change: '+8.2%' },
  { icon: '💰', title: 'Revenue', value: '$2.4M', change: '+15.3%' },
  { icon: '✅', title: 'Payment Rate', value: '87%', change: '+3.1%' },
] as const;

export const StatsSection: React.FC = () => (
  <section className="analysis-section analysis-section-full">
    <div className="analysis-section-header">
      <h2 className="analysis-section-title">📊 Public Stats</h2>
      <span className="analysis-badge">Live</span>
    </div>
    <div className="analysis-section-content">
      <div className="stats-list">
        {STAT_ITEMS.map((item) => (
          <div key={item.title} className="stat-item">
            <div className="stat-item-icon">{item.icon}</div>
            <div className="stat-item-details">
              <h3 className="stat-item-title">{item.title}</h3>
              <p className="stat-item-value">{item.value}</p>
              <span className="stat-item-change positive">{item.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
