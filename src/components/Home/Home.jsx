import React,{useState} from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/NavBar';
import Products from '../Products/Products';
import Inventory from '../Inventory/Invenetory';
import Orders from '../Orders/Orders';
import Stores from '../Stores/Stores';
import Customers from '../Customers/Customers';
import Dashboard from '../Dashboard/Dashboard'
import Distribution from '../Distribution/Distribution';
import { logout } from '../../Database/Database';

const Home = ({ user }) => {
  const navigate=useNavigate();

  const [logoutAttempted, setLogoutAttempted] = useState(false);
  const handleLogoutClick = async () => {
    setLogoutAttempted(true)
    const status=await logout();
    if(status){
      console.log("Logged out")
      navigate('/');
    }
    else{
      console.log("Logout failed")
    }
  };
  return (
    <div className="home-container">
      <div className="action-bar">
        <div className="company-name">Company Name</div>
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
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/distribution" element={<Distribution />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/products" element={<Products />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;
