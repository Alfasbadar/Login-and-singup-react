import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../Home/Home.css';

const Navbar = () => {
  const [navbarVisible, setNavbarVisible] = useState(true);

  const toggleNavbar = () => {
    setNavbarVisible(!navbarVisible);
  };

  return (
    <div className={`navbar-container ${navbarVisible ? 'visible' : 'hidden'}`}>
      <div className="sidebar">
        <div className="navbar">
          <ul>
            <li>
              <NavLink to="/home/dashboard" activeClassName="active">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/home/distribution" activeClassName="active">Distribution</NavLink>
            </li>
            <li>
              <NavLink to="/home/products" activeClassName="active">Products</NavLink>
            </li>
            <li>
              <NavLink to="/home/inventory" activeClassName="active">Inventory</NavLink>
            </li>
            <li>
              <NavLink to="/home/orders" activeClassName="active">Orders</NavLink>
            </li>
            <li>
              <NavLink to="/home/Stores" activeClassName="active">Stores</NavLink>
            </li>
            <li>
              <NavLink to="/home/customers" activeClassName="active">Customers</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
