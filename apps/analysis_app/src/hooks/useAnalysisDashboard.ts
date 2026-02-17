import { useState, useCallback } from 'react';

const NOTIFICATION_AUTO_CLOSE_MS = 3000;
const REPORT_VIEW_DURATION_MS = 3000;

export const useAnalysisDashboard = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedSeoPage, setSelectedSeoPage] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((message: string, clearAfterMs = NOTIFICATION_AUTO_CLOSE_MS) => {
    setNotification(message);
    setTimeout(() => setNotification(null), clearAfterMs);
  }, []);

  const handleViewReport = useCallback((reportName: string) => {
    setSelectedReport(reportName);
    setTimeout(() => setSelectedReport(null), REPORT_VIEW_DURATION_MS);
  }, []);

  const handleViewSeoPage = useCallback((pageName: string) => {
    setSelectedSeoPage(pageName);
    setTimeout(() => setSelectedSeoPage(null), REPORT_VIEW_DURATION_MS);
  }, []);

  const handleGenerateReport = useCallback(() => {
    showNotification('Generating report... This may take a few moments.');
    setTimeout(() => {
      showNotification('Report generated successfully!', NOTIFICATION_AUTO_CLOSE_MS);
    }, 2000);
  }, [showNotification]);

  const handleExportData = useCallback(() => {
    showNotification('Exporting data...');
    setTimeout(() => {
      showNotification('Data exported successfully!', NOTIFICATION_AUTO_CLOSE_MS);
    }, 1500);
  }, [showNotification]);

  const handleRefreshStats = useCallback(() => {
    showNotification('Refreshing statistics...');
    setTimeout(() => {
      showNotification('Statistics refreshed!', NOTIFICATION_AUTO_CLOSE_MS);
    }, 1000);
  }, [showNotification]);

  const closeModal = useCallback(() => {
    setSelectedReport(null);
    setSelectedSeoPage(null);
  }, []);

  return {
    selectedReport,
    selectedSeoPage,
    notification,
    handleViewReport,
    handleViewSeoPage,
    handleGenerateReport,
    handleExportData,
    handleRefreshStats,
    closeModal,
  };
};
