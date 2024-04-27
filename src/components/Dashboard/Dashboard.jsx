import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">      </div>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Total Items</h2>
          <p>500</p>
        </div>
        <div className="dashboard-card">
          <h2>Low Stock Items</h2>
          <p>20</p>
        </div>
        <div className="dashboard-card">
          <h2>Out of Stock Items</h2>
          <p>5</p>
        </div>
        <div className="dashboard-card">
          <h2>Inventory Value</h2>
          <p>$50,000</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
