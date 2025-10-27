import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <h3 className="footer-title">Micro-Frontends Monorepo</h3>
            <p className="footer-description">
              Enterprise-grade billing system with micro-frontend architecture
            </p>
          </div>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#home" className="footer-link">Home</a></li>
            <li><a href="#invoice" className="footer-link">Invoice Management</a></li>
            <li><a href="#payment" className="footer-link">Payment Processing</a></li>
            <li><a href="#analytics" className="footer-link">Analytics</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Technology</h4>
          <ul className="footer-links">
            <li><span className="footer-tech">React 18</span></li>
            <li><span className="footer-tech">AngularJS 1.x</span></li>
            <li><span className="footer-tech">Module Federation</span></li>
            {/* <li><span className="footer-tech">Tailwind CSS</span></li> */}
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Version & Info</h4>
          <div className="footer-info">
            <p className="footer-version">Version 1.0.0</p>
            <p className="footer-build">Build: 2024.10.20</p>
            <p className="footer-environment">Environment: Development</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-copyright">
            <p>&copy; 2025 All rights reserved to <strong>Omar Almashhadani</strong></p>
          </div>
          
          <div className="footer-legal">
            <a href="#license" className="footer-legal-link">License</a>
            <span className="footer-separator">|</span>
            <a href="#privacy" className="footer-legal-link">Privacy Policy</a>
            <span className="footer-separator">|</span>
            <a href="#terms" className="footer-legal-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
