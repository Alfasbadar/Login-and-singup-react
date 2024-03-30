import React, { useState } from 'react';
import './Inventory.css'; // Import your CSS file for styling

function Inventory() {
  const [showPopup, setShowPopup] = useState(false);
  const [inventoryName, setInventoryName] = useState('');
  const [inventoryLocation, setInventoryLocation] = useState('');
  const [accessPasscode, setAccessPasscode] = useState('');
  const [inventories, setInventories] = useState([]);

  const handleCreateInventory = () => {
    const newInventory = { name: inventoryName, location: inventoryLocation, passcode: accessPasscode };
    setInventories([...inventories, newInventory]);
    setShowPopup(false);
    // Additional logic to create inventory can be added here
  };

  return (
    <div className="inventory-container">
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button className="search-button">Search</button>
        <button className="add-inventory-button" onClick={() => setShowPopup(true)}>+ Inventory</button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
            <h2>Create Inventory</h2>
            <input
              type="text"
              placeholder="Inventory Name"
              value={inventoryName}
              onChange={(e) => setInventoryName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={inventoryLocation}
              onChange={(e) => setInventoryLocation(e.target.value)}
            />
            <input
              type="password"
              placeholder="Access Passcode"
              value={accessPasscode}
              onChange={(e) => setAccessPasscode(e.target.value)}
            />
            <div>
              <button className="create-inventory-button" onClick={handleCreateInventory}>Create</button>
              <button className="create-inventory-button" onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Displaying created inventories */}
      {inventories.map((inventory, index) => (
        <div key={index}>
          <h3>{inventory.name}</h3>
          <p>Location: {inventory.location}</p>
          <p>Access Passcode: {inventory.passcode}</p>
        </div>
      ))}
    </div>
  );
}

export default Inventory;
