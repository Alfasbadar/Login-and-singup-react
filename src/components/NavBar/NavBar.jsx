import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar">
        <ul>
          <li>
            <NavLink to="/home" activeClassName="active">Home</NavLink>
          </li>
          <li>
            <NavLink to="/home/shop" activeClassName="active">Shop</NavLink>
          </li>
          <li>
            <NavLink to="/home/items" activeClassName="active">Items</NavLink>
          </li>
          <li>
            <NavLink to="/home/billing" activeClassName="active">Billing</NavLink>
          </li>
          <li>
            <NavLink to="/home/analytics" activeClassName="active">Analytics</NavLink>
          </li>
          <li>
            <NavLink to="/home/about" activeClassName="active">About</NavLink>
          </li>
          <li>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
