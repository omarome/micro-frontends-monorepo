
import React from 'react';
import { NavLink } from 'react-router-dom';

import ReactIcon from '../assets/react.svg';
import AngularIcon from '../assets/angularjs.svg';

const NavBar = () => (
  <nav >
    <NavLink to="/">
      Home (Shell)
    </NavLink>
    <NavLink to="/legacy">
      <img src={AngularIcon} alt="AngularJS" style={{height: 20, verticalAlign: 'middle', marginRight: 8}} />
      Legacy App
    </NavLink>
    <NavLink to="/astrobyte">
      <img src={ReactIcon} alt="React" style={{height: 20, verticalAlign: 'middle', marginRight: 8}} />
      AstroByte
    </NavLink>
    <NavLink to="/app3">
      App 3
    </NavLink>
  </nav>
);

export default NavBar;