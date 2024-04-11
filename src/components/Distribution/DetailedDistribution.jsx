import React, { useState, useEffect, useRef } from 'react';
import './DetailedDistribution.css';
import DistributionBill from './DistributionBill';
import { distributorCreateBill, retrieveBills } from '../../Database/Distribution';

function DetailedDistribution({ distributor, onBackClick, products }) {
  const [bills, setBills] = useState([]);
  const [newBill, setNewBill] = useState({  
    id: '',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    products: [],
    total: 0
  });
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [selectedBillIndex, setSelectedBillIndex] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    // Load bills when component mounts
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const distributorBills = await retrieveBills(distributor.id);
      setBills(distributorBills);
    } catch (error) {
      console.error('Error loading bills:', error);
    }
  };

  const handleNewBillClick = () => {
    setShowAddBillModal(true);
  };

  const handleCreateBill = async () => {
    console.log("Clicled create bill")
    try {
      console.log("Creating Bill with data", newBill);
      const createdBill = await distributorCreateBill(newBill, distributor);
      setBills([...bills, createdBill]);
      setShowAddBillModal(false);
      setNewBill({  // Reset newBill state
        id: '',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        products: [],
        total: 0,
        expanded: false
      });
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  const handleAddProduct = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
      setShowAddProductModal(false);
      const updatedBills = [...bills];
      const selectedBill = updatedBills[selectedBillIndex];
      const updatedProducts = [...selectedBill.products, selectedProduct];
      selectedBill.products = updatedProducts;
      setSelectedBillIndex(null);
      setBills(updatedBills);
    }
  };

  const handleBillClick = (index) => {
    setBills(prevBills => {
      const updatedBills = prevBills.map((bill, i) => {
        if (i === index) {
          return { ...bill, expanded: !bill.expanded }; // Toggle expanded state
        } else {
          return { ...bill, expanded: false }; // Close other bill cards
        }
      });
      return updatedBills;
    });
    setSelectedBillIndex(index); // Update the selected bill index
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term.trim() !== '') {
      const filteredProducts = products.filter(product =>
        product.id.toLowerCase().includes(term) ||
        product.productName.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
      setSearchSuggestions(filteredProducts);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSuggestionClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="detailed-distribution-container">
      <div className="header">
        <button onClick={onBackClick} className="back-button">Back</button>
        <div className="distributor-info">
          <h2>{distributor.name}</h2>
          <p>ID: {distributor.id}</p>
          <p>Location: {distributor.location}</p>
        </div>
      </div>
      <div className="bills">
        <div className="add-bill">
          <button onClick={handleNewBillClick} className="add-bill-button">+ Bill</button>
        </div>
        {showAddBillModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowAddBillModal(false)}>&times;</span>
              <h2>New Bill</h2>
              <input
                type="text"
                placeholder="Enter Bill ID"
                value={newBill.id}
                onChange={(e) => setNewBill({ ...newBill, id: e.target.value })}
                className="input"
              />
              <label>Date:</label>
              <input
                type="text"
                value={newBill.date}
                readOnly
                className="input"
              />
              <label>Time:</label>
              <input
                type="text"
                value={newBill.time}
                readOnly
                className="input"
              />
              <button onClick={handleCreateBill} className="add-button">Create</button>
            </div>
          </div>
        )}
        {bills.map((bill, index) => (
          <DistributionBill
            key={index}
            bill={bill}
            index={index}
            onBillClick={handleBillClick}
            searchTerm={searchTerm}
            searchSuggestions={searchSuggestions}
            isSearchFocused={isSearchFocused}
            onSearchChange={handleSearchChange}
            onSearchFocus={handleSearchFocus}
            onSearchBlur={handleSearchBlur}
            onSuggestionClick={handleSuggestionClick}
            searchRef={searchRef}
            products={products} // Pass products prop to DistributionBill
            distributor={distributor} // Pass distributor prop to DistributionBill
            expanded={index === selectedBillIndex} // Pass whether the bill is expanded or not
          />
        ))}
      </div>
      {showAddProductModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddProductModal(false)}>&times;</span>
            <h2>Add Product</h2>
            <input
              type="text"
              placeholder="Search and add product"
              value={searchTerm}
              onChange={handleSearchChange}
              className="input"
            />
            <div className="search-suggestions">
              {searchSuggestions.map((product, index) => (
                <div
                  key={index}
                  className="suggestion"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div>{product.id}</div>
                  <div>{product.productName}</div>
                  <div>{product.brand}</div>
                </div>
              ))}
            </div>
            <button onClick={handleAddProduct} className="add-button">Add Product</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailedDistribution;
