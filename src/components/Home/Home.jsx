import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/NavBar';
import Products from '../Products/Products';
import Inventory from '../Inventory/Invenetory';
import Orders from '../Orders/Orders';
import Stores from '../Stores/Stores';
import Customers from '../Customers/Customers';
import Dashboard from '../Dashboard/Dashboard';
import Distribution from '../Distribution/Distribution';
import { logout, getAllProducts } from '../../Database/Database';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    };
    fetchData();
  }, []);

  const handleLogoutClick = async () => {
    const status = await logout();
    if (status) {
      console.log("Logged out");
      navigate('/');
    } else {
      console.log("Logout failed");
    }
  };

  return (
    <div className="home-container">
      <div className="action-bar">
        <div className="company-name">Stockdash</div>
        <div className="action-buttons">
          <div className="profile-button">Profile</div>
          <div className="logout-button" onClick={handleLogoutClick}>Logout</div>
        </div>
      </div>
      <div className="content">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="body">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/distribution" element={<Distribution user={user} products={products} />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory products={products} />} />
            <Route path="/products" element={<Products products={products} />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;
