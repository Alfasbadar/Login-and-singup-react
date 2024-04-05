import React, { useState } from 'react';
import './InventoryDetails.css'; // Add your CSS file for InventoryDetails styling

const InventoryDetails = ({ inventory, onBackClick, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter products based on search term
    if (term.trim() !== '') {
      const suggestions = products.filter((product) => {
        if (!product || typeof product !== 'object') {
          console.error('Invalid product:', product);
          return false;
        }
        const { id, productName, distributorName } = product;
        return (
          id.includes(term) ||
          productName.toLowerCase().includes(term.toLowerCase()) ||
          distributorName.toLowerCase().includes(term.toLowerCase())
        );
      });

      setSearchSuggestions(suggestions.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setSearchSuggestions([]); // Clear suggestions if search term is empty
    }
  };

  const handleSearchSelect = (selectedProduct) => {
    console.log(`${selectedProduct.productName} added to inventory`);
    setAddedItems([...addedItems, selectedProduct]);
    setSearchTerm(''); // Clear search term after selection
    setShowSearchBar(false); // Hide search bar after adding product
  };

  const handleToggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    setSearchTerm(''); // Clear search term when toggling search bar
  };

  const handleSearchBlur = () => {
    setShowSearchBar(false); // Hide search bar when it loses focus
    setSearchTerm(''); // Clear search term when search bar loses focus
  };

  return (
    <div className="inventory-details">
      <div className="inventory-info">
        <button className="back-button" onClick={onBackClick}>Back</button>
        <h1>{inventory.name} <span className="subscript">ID: {inventory.id}</span></h1>
        <p className="location">Location: {inventory.location}</p>
      </div>
      <div className="product-cardview">
        <div className="product-header">
          <h2 className="list-title">Products</h2>
          <button className="add-product-button" onClick={handleToggleSearchBar}>
            {showSearchBar ? '+' : 'Add Product'}
          </button>
          {showSearchBar && (
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={handleSearchBlur}
            />
          )}
          {searchSuggestions.length > 0 && showSearchBar && (
            <div className="search-suggestions">
              {searchSuggestions.map((product) => (
                <div key={product.id} className="suggestion-item" onClick={() => handleSearchSelect(product)}>
                  <p>{product.productName}</p>
                  <p>ID: {product.id}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Distributor: {product.distributorName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card-container">
          {addedItems.length > 0 ? (
            addedItems.map((product) => (
              <div key={product.id} className="product-card">
                <p>{product.productName}</p>
                <p>ID: {product.id}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Distributor: {product.distributorName}</p>
              </div>
            ))
          ) : (
            <p>No products added</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryDetails;
