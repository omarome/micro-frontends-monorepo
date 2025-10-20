
import React from 'react';
import { NavLink } from 'react-router-dom';

import ReactIcon from '../assets/react.svg';
import AngularIcon from '../assets/angularjs.svg';

const NavBar = () => (
  <nav className="nav-bar">
    <div className="nav-brand">
      <span className="brand-icon">🏠</span>
      <span className="brand-text">MFE Shell</span>
    </div>
    
    <div className="nav-links">
      <NavLink 
        to="/" 
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
      >
        <span className="link-icon">🏠</span>
        <span className="link-text">Home</span>
      </NavLink>
      
      <NavLink 
        to="/invoice" 
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
      >
        <img src={AngularIcon} alt="AngularJS" className="link-icon" />
        <span className="link-text">Invoice MFE</span>
      </NavLink>
      
      <NavLink 
        to="/astrobyte" 
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
      >
        <img src={ReactIcon} alt="React" className="link-icon" />
        <span className="link-text">AstroByte</span>
      </NavLink>
      
      <NavLink 
        to="/app3" 
        className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
      >
        <span className="link-icon">🚀</span>
        <span className="link-text">App 3</span>
      </NavLink>
    </div>
  </nav>
);

export default NavBar;