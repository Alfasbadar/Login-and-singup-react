import React, { useState, useEffect } from 'react';
import './Inventory.css';
import { addInventoryToDatabase, getAllInventory, getAllProducts } from '../../Database/Database';
import InventoryDetails from './InventoryDetails';

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [showAddInventoryForm, setShowAddInventoryForm] = useState(false);
  const [newInventory, setNewInventory] = useState({
    id: '',
    name: '',
    location: '',
    accessKey: '',
    products: []
  });
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    getAllInventoryFromDatabase();
    fetchAllProducts(); // Fetch all products
  }, []);

  const getAllInventoryFromDatabase = async () => {
    try {
      const allInventory = await getAllInventory();
      setInventoryData(allInventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const products = await getAllProducts();
      setAllProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddInventory = () => {
    setShowAddInventoryForm(true);
  };

  const handleInventorySubmit = async () => {
    try {
      await addInventoryToDatabase(newInventory);
      setInventoryData([...inventoryData, newInventory]);
      setShowAddInventoryForm(false);
      setNewInventory({
        id: '',
        name: '',
        location: '',
        accessKey: '',
        products: []
      });
    } catch (error) {
      console.error('Error adding inventory:', error);
    }
  };

  const handleChange = (e) => {
    setNewInventory({ ...newInventory, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setShowAddInventoryForm(false);
  };

  const handleInventoryClick = (inventory) => {
    setSelectedInventory(inventory);
  };

  const handleBackClick = () => {
    setSelectedInventory(null);
  };

  if (selectedInventory) {
    return (
      <InventoryDetails inventory={selectedInventory} onBackClick={handleBackClick} products={allProducts}/>
    );
  }

  return (
    <div className="cool-component">
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
      <div className="add-inventory-button">
        <button onClick={handleAddInventory}>+ Add Inventory</button>
      </div>
      {showAddInventoryForm && (
        <div className="popup-cardview">
          <div className="popup-content">
            <span className="close" onClick={handleCancel}>&times;</span>
            <h2>Add Inventory</h2>
            <input
              type="text"
              name="id"
              placeholder="Inventory ID"
              value={newInventory.id}
              onChange={handleChange}
            />
            <input
              type="text"
              name="name"
              placeholder="Inventory Name"
              value={newInventory.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newInventory.location}
              onChange={handleChange}
            />
            <input
              type="text"
              name="accessKey"
              placeholder="Access Key"
              value={newInventory.accessKey}
              onChange={handleChange}
            />
            <div className="button-container">
              <button className="add" onClick={handleInventorySubmit}>Add</button>
              <button className="cancel" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="inventory-cards">
        {inventoryData.map((inventory, index) => (
          <div key={index} className="inventory-card" onClick={() => handleInventoryClick(inventory)}>
            <p>{inventory.id}</p>
            <p>{inventory.name}</p>
            <p>{inventory.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
