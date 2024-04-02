import React, { useState, useEffect } from 'react';
import { addInventoryToDatabase, getAllInventory } from '../../Database/Database';
import './Inventory.css';

function Inventory() {
  const [showPopup, setShowPopup] = useState(false);
  const [inventoryName, setInventoryName] = useState('');
  const [inventoryLocation, setInventoryLocation] = useState('');
  const [accessPasscode, setAccessPasscode] = useState('');
  const [inventories, setInventories] = useState([]);
  const [inventoryID, setInventoryId] = useState('');
  const [sortOrder, setSortOrder] = useState({
    id: 'desc',
    name: 'desc',
    location: 'desc',
    itemsCount: 'desc'
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const inventoryData = await getAllInventory();
      setInventories(inventoryData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleCreateInventory = () => {
    const newInventory = { id: inventoryID, name: inventoryName, location: inventoryLocation, passcode: accessPasscode, productsByID: [] };
    setInventories([...inventories, newInventory]);
    setShowPopup(false);
    if (addInventoryToDatabase(newInventory))
      console.log("Inventory added to database")
  };

  const handleSort = (column) => {
    const newSortOrder = { ...sortOrder };
    newSortOrder[column] = sortOrder[column] === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
  };

  const sortedInventories = [...inventories].sort((a, b) => {
    if (sortOrder.id === 'asc') {
      return a.id.localeCompare(b.id);
    } else {
      return b.id.localeCompare(a.id);
    }
  });

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
            <input type="text" placeholder="ID" value={inventoryID} onChange={(e) => setInventoryId(e.target.value)} />
            <input type="text" placeholder="Inventory Name" value={inventoryName} onChange={(e) => setInventoryName(e.target.value)} />
            <input type="text" placeholder="Location" value={inventoryLocation} onChange={(e) => setInventoryLocation(e.target.value)} />
            <input type="password" placeholder="Access Passcode" value={accessPasscode} onChange={(e) => setAccessPasscode(e.target.value)} />
            <div>
              <button className="create-inventory-button" onClick={handleCreateInventory}>Create</button>
              <button className="create-inventory-button" onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="inventory-table">
        <table>
          <thead>
            <tr className="inventory-item-header">
              <th onClick={() => handleSort('id')}>ID {sortOrder.id === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>}</th>
              <th onClick={() => handleSort('name')}>Name {sortOrder.name === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>}</th>
              <th onClick={() => handleSort('location')}>Location {sortOrder.location === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>}</th>
              <th onClick={() => handleSort('itemsCount')}>Items Count {sortOrder.itemsCount === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>}</th>
            </tr>
          </thead>
          <tbody>
            {sortedInventories.map((inventory, index) => (
              <tr className="inventory-item" key={index}>
                <td>{inventory.id}</td>
                <td>{inventory.name}</td>
                <td>{inventory.location}</td>
                <td>{inventory.productsByID.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
