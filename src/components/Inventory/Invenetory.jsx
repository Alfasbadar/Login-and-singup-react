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
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchSuggestions.length > 0) {
      handleSelectProduct(searchSuggestions[0]);
    }
  };

  const handleSelectProduct = (selectedProduct) => {
    setSelectedInventory(selectedProduct);
    setSearchTerm('');
    setSearchSuggestions([]);
    setShowSearchBar(false); // Hide search bar after selection, adjust as per UI/UX
    setShowAddInventoryForm(false); // Reset any form visibility state, adjusted from setShowAddProductForm
    setShowAddInventoryForm(true); // Adjust if necessary based on inventory details
  };

  const handleAdd = () => {
    setIsDialogOpen(true);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Filter products based on search term
    const filteredProducts = allProducts.filter(product => {
      return (
        product.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Add other fields as needed for search
        product.distributorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setSearchSuggestions(filteredProducts);
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
      <div className="header">
        <div className={`search-bar-container ${showSearchBar ? 'active' : ''}`}>
          <input
            type="text"
            placeholder="Search product"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className={showSearchBar ? 'visible' : ''}
          />
          <button onClick={() => setShowSearchBar(!showSearchBar)}>
            {showSearchBar ? 'Cancel' : 'Search'}
          </button>
        </div>
        {showSearchBar && (
          <div className="search-suggestions">
            {searchSuggestions.map((product, index) => (
              <div
                key={index}
                className="suggestion"
                onClick={() => handleSelectProduct(product)}
              >
                {product.productName} {/* Display relevant information */}
              </div>
            ))}
            {searchSuggestions.length === 0 && searchTerm && (
              <div className="create-new" onClick={handleAdd}>
                Create new Product
              </div>
            )}
          </div>
        )}
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
      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((inventory, index) => (
              <tr key={index} onClick={() => handleInventoryClick(inventory)}>
                <td>{inventory.id}</td>
                <td>{inventory.name}</td>
                <td>{inventory.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      <div className="add-inventory-button">
        <button onClick={handleAddInventory}>+ Add Inventory</button>
      </div>
      </div>
    </div>
  );
};

export default Inventory;
