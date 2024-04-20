import React, { useState, useEffect } from 'react';
import './MoveToInventoryPopup.css';
import {addInventoryToDatabase, deleteInventoryFromDatabase} from '../..//Database/Database'

function MoveToInventoryPopup({ inventoryData, onClose, billID, distributorID }) {
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    // Check if inventoryData is not empty and update the state
    if (inventoryData && inventoryData.length > 0) {
      setInventories(inventoryData);
    }
  }, [inventoryData]);

  const handleInventoryClick = (clickedInventory) => {
    console.log("Clicked inventory:", clickedInventory);
    console.log("Bill id ", billID);
    console.log("Distributor ID", distributorID);
    console.log("Products in inventory", clickedInventory.products);

    // Create a new array containing distributor ID, bill ID, and clicked inventory's products
    const updatedProducts = [
      ...clickedInventory.products,
      {
        distributorID: distributorID,
        billID: billID
      }
    ];


    console.log("After appending distrbutor and bill", updatedProducts)

    console.log("saving products to inventoryItems")
  
    clickedInventory.products=updatedProducts;
  
    console.log("Products synced with inventory",clickedInventory.products)


    console.log("Updating Inventory database")
    if(deleteInventoryFromDatabase(clickedInventory._id)){
        console.log("Inventory deleted")
        if(addInventoryToDatabase(clickedInventory)){
            console.log("inventory updated with newly entered bill")
        }
    }

    onClose(); // Close the popup
  };


  // Map over inventories and display as lists
  const inventoryItems = inventories.map((inventory, index) => (
    <li key={index} onClick={() => handleInventoryClick(inventory)}>
      ID: {inventory.id} - Name: {inventory.name} - Location: {inventory.location}
    </li>
  ));

  // Log the inventory data
  console.log("Inventories are consoled:", inventories);

  return (
    <div className="move-to-inventory-popup">
      <div className="popup-content">
        <h2>Inventory</h2>
        <ul>
          {inventoryItems}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default MoveToInventoryPopup;
