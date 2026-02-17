import React from 'react';

interface NotificationToastProps {
  message: string;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message }) => (
  <div className="analysis-notification">
    <div className="analysis-notification-content">
      <span className="analysis-notification-icon">ℹ️</span>
      <span className="analysis-notification-text">{message}</span>
    </div>
  </div>
);
