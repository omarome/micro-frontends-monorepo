import React from 'react';
import '@ui-styles/shared-styles.css';
import '@ui-styles/analysis-styles.css';
import { useTheme } from './hooks/useTheme';
import { useAnalysisDashboard } from './hooks/useAnalysisDashboard';
import { NotificationToast } from './components/NotificationToast';
import { ViewModal } from './components/ViewModal';
import { DashboardSection } from './components/DashboardSection';
import { StatsSection } from './components/StatsSection';
import { ReportsSection } from './components/ReportsSection';
import { SeoPagesSection } from './components/SeoPagesSection';
import { ReportModalContent } from './components/ReportModalContent';
import { SeoModalContent } from './components/SeoModalContent';

const App: React.FC = () => {
  const isDarkMode = useTheme();
  const {
    selectedReport,
    selectedSeoPage,
    notification,
    handleViewReport,
    handleViewSeoPage,
    handleGenerateReport,
    handleExportData,
    handleRefreshStats,
    closeModal,
  } = useAnalysisDashboard();

  const modalTitle = selectedReport ?? selectedSeoPage ?? '';

  return (
    <div className="analysis-app-container" data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="analysis-header">
        <h1 className="analysis-title">📈 Analysis Dashboard</h1>
        <p className="analysis-subtitle">Comprehensive analytics and reporting</p>
      </div>

      <div className="analysis-grid">
        <DashboardSection
          onGenerateReport={handleGenerateReport}
          onExportData={handleExportData}
          onRefreshStats={handleRefreshStats}
        />
        <StatsSection />
        <ReportsSection onViewReport={handleViewReport} />
        <SeoPagesSection onViewSeoPage={handleViewSeoPage} />
      </div>

      {notification && <NotificationToast message={notification} />}

      {modalTitle && (
        <ViewModal title={modalTitle} onClose={closeModal}>
          {selectedReport && <ReportModalContent />}
          {selectedSeoPage && <SeoModalContent />}
        </ViewModal>
      )}
    </div>
  );
};

export default App;
