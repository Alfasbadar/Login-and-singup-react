import React, { useState, useEffect } from 'react';
import './MoveToInventoryPopup.css';
import { addInventoryToDatabase, deleteInventoryFromDatabase } from '../../Database/Database';

function MoveToInventoryPopup({ inventoryData, onClose, billID, distributorID }) {
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      setInventories(inventoryData);
    }
  }, [inventoryData]);

  const handleInventoryClick = (clickedInventory) => {
    console.log("Clicked inventory:", clickedInventory);
    console.log("Bill id ", billID);
    console.log("Distributor ID", distributorID);
    console.log("Products in inventory", clickedInventory.products);

    const updatedProducts = [
      ...clickedInventory.products,
      {
        distributorID: distributorID,
        billID: billID,
      },
    ];

    console.log("After appending distributor and bill", updatedProducts);

    clickedInventory.products = updatedProducts;

    console.log("Products synced with inventory", clickedInventory.products);

    console.log("Updating Inventory database");
    if (deleteInventoryFromDatabase(clickedInventory._id)) {
      console.log("Inventory deleted");
      if (addInventoryToDatabase(clickedInventory)) {
        console.log("Inventory updated with newly entered bill");
      }
    }

    onClose();
  };

  const inventoryItems = inventories.map((inventory, index) => (
    <li key={index} onClick={() => handleInventoryClick(inventory)} className="inventory-item">
      <div className="inventory-id">{inventory.id}</div>
      <div className="inventory-details">
        <div className="inventory-name">{inventory.name}</div>
        <div className="inventory-location">{inventory.location}</div>
      </div>
    </li>
  ));

  return (
    <div className="move-to-inventory-popup">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Select Inventory</h2>
        </div>
        <ul className="inventory-list">
          {inventoryItems}
        </ul>
        <button className="move-to-inventory-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default MoveToInventoryPopup;
