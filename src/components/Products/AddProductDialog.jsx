// AddProductDialog.js
import React, { useState } from 'react';
import './AddProductDialog.css'; // Import CSS file
import { addProductToDatabase } from '../../Database/Database';

const AddProductDialog = ({ onClose }) => {
  const [productDetails, setProductDetails] = useState({
    id: '',
    brand: '',
    type: '',
    name: '',
    description: '',
    quantity: '',
    buyPrice: '',
    sellPrice: '',
    distributorVisible: false,
    distributorName: '',
    distributorPhone: '',
    profit: '',
    expiry: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleToggleDistributor = () => {
    setProductDetails(prevState => ({
      ...prevState,
      distributorVisible: !prevState.distributorVisible
    }));
  };

  const handleSave = async () => {
    try {
      // Calculate profit and expiry
      const profit = parseFloat(productDetails.sellPrice) - parseFloat(productDetails.buyPrice);
      const expiry = new Date(); // Add your logic for calculating expiry date
      const updatedProductDetails = {
        ...productDetails,
        profit: profit.toFixed(2),
        expiry: expiry
      };
  
      console.log('Adding product to database');
      const status = await addProductToDatabase(updatedProductDetails); // Wait for the result of addProductToDatabase
  
      if (status) {
        console.log("Product added");
        onClose();
      } else {
        console.log("Product add failed");
      }
    } catch (error) {
      console.error('Error adding product:', error);
      // Handle error
    }
  };
  

  const handleCancel = () => {
    onClose(); // Close the dialog without saving
  };

  return (
    <div className="add-product-dialog">
      <div className="dialog-header">
        <h2 className="dialog-title">Add Product</h2>
        <button className="close-button" onClick={handleCancel}>X</button>
      </div>
      <div className="input-grid">
        <div className="input-field">
          <input type="text" name="id" value={productDetails.id} onChange={handleChange} placeholder="ID" />
          <input type="text" name="brand" value={productDetails.brand} onChange={handleChange} placeholder="Brand" />
        </div>
        <div className="input-field">
          <input type="text" name="type" value={productDetails.type} onChange={handleChange} placeholder="Type" />
          <input type="text" name="name" value={productDetails.name} onChange={handleChange} placeholder="Name" />
        </div>
        <div className="input-field">
          <textarea rows="4" name="description" value={productDetails.description} onChange={handleChange} placeholder="Description"></textarea>
        </div>
        <div className="input-field">
          <input type="number" name="quantity" value={productDetails.quantity} onChange={handleChange} placeholder="Qty" />
          <input type="text" name="buyPrice" value={productDetails.buyPrice} onChange={handleChange} placeholder="BP" />
          <input type="text" name="sellPrice" value={productDetails.sellPrice} onChange={handleChange} placeholder="SP" />
        </div>
        <div className="input-field">
          <input type="text" value={productDetails.profit} readOnly placeholder="Profit" />
          <input type="text" value={productDetails.expiry} readOnly placeholder="Expiry" />
        </div>
      </div>
      {productDetails.distributorVisible && (
        <div className="distributor-grid">
          <div className="input-field">
            <input type="text" name="distributorName" value={productDetails.distributorName} onChange={handleChange} placeholder="Distributor Name" />
          </div>
          <div className="input-field">
            <input type="text" name="distributorPhone" value={productDetails.distributorPhone} onChange={handleChange} placeholder="Distributor Phone" />
          </div>
        </div>
      )}
      <div className="button-container">
        <button className="distributor-button" onClick={handleToggleDistributor}>
          {productDetails.distributorVisible ? "Remove Supplier" : "Add Supplier"}
        </button>
        <button className="save-button" onClick={handleSave}>Add</button>
        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default AddProductDialog;
