import React, { useState, useEffect } from 'react';
import './InventoryDetails.css'; // Import your CSS file for InventoryDetails styling
import { retrieveBills } from '../../Database/Database';

const InventoryDetails = ({ inventory, onBackClick, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [retrievedProducts, setRetrievedProducts] = useState([]);

  useEffect(() => {
    console.log('Inventory:', inventory);
    const inventoryProducts = inventory.products;

    // Extracting bill and distributor IDs together and storing them in an array
    const billsArr = inventoryProducts.map((product) => {
      return { billID: product.billID, distributorID: product.distributorID };
    });

    // Retrieve and sort products for each distributor ID
    const getAllProducts = async () => {
      const allProducts = [];
      for (let bill of billsArr) {
        const retrieved = await retrieveBills(bill.distributorID);
        if (retrieved && retrieved.length > 0) {
          retrieved.forEach((bill) => {
            const sortedProducts = bill.products.map((product) => ({
              id: product.id,
              productName: product.productName,
              price: product.price,
              quantity: product.quantity
            })).sort((a, b) => a.productName.localeCompare(b.productName));
            allProducts.push(...sortedProducts);
          });
        }
      }
      return allProducts;
    };

    getAllProducts().then((allProducts) => {
      setRetrievedProducts(allProducts);
    });
  }, [inventory]);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter products based on search term
    if (term.trim() !== '') {
      const suggestions = products.filter((product) => {
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
            {showSearchBar ? '-' : '+'}
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
          {retrievedProducts.length > 0 ? (
            retrievedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <h3>{product.productName}</h3>
                <p>ID: {product.id}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Price: {product.price}</p>
              </div>
            ))
          ) : (
            <p>No products retrieved</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryDetails;
