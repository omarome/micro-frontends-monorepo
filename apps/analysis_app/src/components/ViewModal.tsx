import React from 'react';

interface ViewModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const ViewModal: React.FC<ViewModalProps> = ({ title, onClose, children }) => (
  <div className="analysis-modal-overlay" onClick={onClose} role="presentation">
    <div className="analysis-modal" onClick={(e) => e.stopPropagation()} role="dialog">
      <div className="analysis-modal-header">
        <h2 className="analysis-modal-title">{title}</h2>
        <button type="button" className="analysis-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <div className="analysis-modal-content">{children}</div>
      <div className="analysis-modal-actions">
        <button type="button" className="analysis-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);
