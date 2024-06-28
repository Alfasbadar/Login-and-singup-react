import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './../Home/Home.css';
import customericon from './../../Assets/customers.png';
import dashboardicon from './../../Assets/dashboard.png';
import distributionicon from './../../Assets/distribution.png';
import inventoryicon from './../../Assets/inventory.png';
import productsicon from './../../Assets/products.png';
import storesicon from './../../Assets/stores.png';

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
              <NavLink to="/home/dashboard" activeClassName="active">
                <img src={dashboardicon} alt="Dashboard" width="30px"/>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/distribution" activeClassName="active">
                <img src={distributionicon} alt="Distribution" width="30px"/>
                <span>Distribution</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/products" activeClassName="active">
                <img src={productsicon} alt="Products" width="30px"/>
                <span>Products</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/inventory" activeClassName="active">
                <img src={inventoryicon} alt="Inventory" width="30px"/>
                <span>Inventory</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/orders" activeClassName="active">
                <img src={customericon} alt="Orders" width="30px"/>
                <span>Orders</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/stores" activeClassName="active">
                <img src={storesicon} alt="Stores" width="30px"/>
                <span>Stores</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/customers" activeClassName="active">
                <img src={customericon} alt="Customers" width="30px"/>
                <span>Customers</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
