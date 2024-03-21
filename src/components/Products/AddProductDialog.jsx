import React, { useState } from 'react';
import './Products.css';

const AddProductDialog = () => {
  const [showDistributor, setShowDistributor] = useState(false);
  const [showNewDistributor, setShowNewDistributor] = useState(false);
  const [distributorName, setDistributorName] = useState('');
  const [distributorPhone, setDistributorPhone] = useState('');
  const [distributorComments, setDistributorComments] = useState('');

  const handleAddDistributor = () => {
    setShowDistributor(true);
  };

  const handleNewDistributor = () => {
    setShowNewDistributor(true);
  };

  const handleCloseDistributor = () => {
    setShowDistributor(false);
  };

  const handleCloseNewDistributor = () => {
    setShowNewDistributor(false);
  };

  const handleSaveDistributor = () => {
    console.log('Distributor Name:', distributorName);
    console.log('Distributor Phone:', distributorPhone);
    console.log('Distributor Comments:', distributorComments);
    setShowNewDistributor(false);
  };

  const handleAddProduct = () => {
    // Handle adding product functionality
  };

  return (
    <div className="add-product-container">
      <div className="add-product-section">
        <div className="field-container">
          <label>ID:</label>
          <input type="text" />
        </div>
        <div className="field-container">
          <label>Brand:</label>
          <input type="text" />
        </div>
        <div className="field-container">
          <label>Type:</label>
          <input type="text" />
        </div>
        <div className="field-container">
          <label>Name:</label>
          <input type="text" />
        </div>
        <div className="field-container">
          <label>Description:</label>
          <textarea rows="4"></textarea>
        </div>
        <div className="field-container">
          <label>Qty:</label>
          <input type="number" />
        </div>
        <div className="field-container">
          <label>By Price:</label>
          <input type="text" />
        </div>
        <div className="field-container">
          <label>Sell Price:</label>
          <input type="text" />
        </div>
        <div className="field-container">
          <label>Auto Generate Profit %:</label>
          <input type="text" />
        </div>
        <div className="field-container">
          <label>Expiry:</label>
          <input type="date" />
        </div>
        <button className="add-distributor-button" onClick={handleAddDistributor}>+ Distributor</button>
        <button className="add-product-button" onClick={handleAddProduct}>Add Product</button>
      </div>
      {showDistributor && (
        <div className="distributor-section">
          <div className="dropdown">
            <input type="text" placeholder="Search distributor..." />
            <button className="close-button" onClick={handleCloseDistributor}>X</button>
          </div>
          <button className="new-distributor-button" onClick={handleNewDistributor}>New Distributor</button>
        </div>
      )}
      {showNewDistributor && (
        <div className="new-distributor-section">
          <input type="text" placeholder="Distributor Name" onChange={(e) => setDistributorName(e.target.value)} />
          <input type="text" placeholder="Distributor Phone" onChange={(e) => setDistributorPhone(e.target.value)} />
          <textarea placeholder="Comments" rows="4" onChange={(e) => setDistributorComments(e.target.value)}></textarea>
          <button className="save-distributor-button" onClick={handleSaveDistributor}>Save</button>
          <button className="close-button" onClick={handleCloseNewDistributor}>X</button>
        </div>
      )}
    </div>
  );
};

export default AddProductDialog;
