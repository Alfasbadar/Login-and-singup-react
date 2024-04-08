// DetailedDistribution.jsx

import React, { useState, useRef } from 'react';
import './DetailedDistribution.css';

function DetailedDistribution({ distributor, onBackClick, products }) {
  const [bills, setBills] = useState([]);
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [newBill, setNewBill] = useState({
    id: '',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    products: [],
    total: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isQuantityFocused, setIsQuantityFocused] = useState(false);
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  const quantityRefs = useRef([]);
  const priceRefs = useRef([]);
  const searchRef = useRef(null);

  const handleNewBillClick = () => {
    setShowAddBillModal(true);
  };

  const handleAddBill = () => {
    setBills([...bills, newBill]);
    setShowAddBillModal(false);
    setNewBill({
      id: '',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      products: [],
      total: 0
    });
  };

  const handleCancelAddBill = () => {
    setShowAddBillModal(false);
  };

  const handleChange = (e) => {
    setNewBill({ ...newBill, [e.target.name]: e.target.value });
  };

  const handleBillClick = (index, event) => {
    event.stopPropagation();
    const updatedBills = bills.map((bill, i) => {
      if (i === index) {
        return { ...bill, expanded: true }; // Always expand the clicked card
      } else {
        return { ...bill, expanded: false }; // Collapse other cards
      }
    });
    setBills(updatedBills);
  };
  
  const handleProductAdd = (product) => {
    console.log("Clicked prodcut ",product)
    const updatedProducts = [...newBill.products, product];
    setNewBill({ ...newBill, products: updatedProducts });
    setSearchTerm('');
    setSearchSuggestions([]);
    setIsQuantityFocused(true);
    quantityRefs.current[updatedProducts.length - 1].focus();
  };
  

  const handleSearchChange = (e) => {
    console.log("handling search term",e.target.value)
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    const filteredProducts = products.filter(product =>
      product.id.toLowerCase().includes(term) ||
      product.productName.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
    setSearchSuggestions(filteredProducts);
    console.log("filtered products are ",searchSuggestions)
  };

  const handleSearchFocus = (event) => {
    event.stopPropagation();
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleQuantityEnter = (e, idx) => {
    if (e.key === 'Enter') {
      setIsQuantityFocused(false);
      setIsPriceFocused(true);
      priceRefs.current[idx].focus();
    }
  };
  

  const handlePriceEnter = (e) => {
    if (e.key === 'Enter') {
      setIsPriceFocused(false);
      setIsSearchFocused(true);
      searchRef.current.focus();
    }
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
              <span className="close" onClick={handleCancelAddBill}>&times;</span>
              <h2>New Bill</h2>
              <input
                type="text"
                name="id"
                placeholder="Enter Bill ID"
                value={newBill.id}
                onChange={handleChange}
                className="input"
              />
              <input
                type="text"
                name="date"
                value={newBill.date}
                onChange={handleChange}
                className="input"
                disabled
              />
              <input
                type="text"
                name="time"
                value={newBill.time}
                onChange={handleChange}
                className="input"
                disabled
              />
              <div className="button-container">
                <button onClick={handleAddBill} className="add-button">Create</button>
                <button onClick={handleCancelAddBill} className="cancel-button">Cancel</button>
              </div>
            </div>
          </div>
        )}
        {bills.length > 0 ? (
          bills.map((bill, index) => (
            <div key={index} className={`bill-card ${bill.expanded ? 'expanded' : ''}`} onClick={(event) => handleBillClick(index, event)}>
              <div className="bill-header">
                <p>{bill.id}</p>
                <p>{bill.date}</p>
                <p>{bill.time}</p>
                <p>{bill.products.length}</p>
                <p>{bill.total}</p>
              </div>
              {bill.expanded && (
                <div className="bill-items">
                  <input
                    type="text"
                    placeholder="Search and add product"
                    className="product-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    ref={searchRef}
                  />
                  {isSearchFocused && (
                    <div className="search-suggestions">
                      {searchSuggestions.map((product, idx) => (
                        <div key={idx} className="suggestion" onClick={() => handleProductAdd(product.id)}>
  <div>{product.id}</div>
  <div>{product.brand}</div>
  <div>{product.productName}</div>
</div>

                      ))}
                    </div>
                  )}
                  <button onClick={handleProductAdd} className="add-product-button">Add Product</button>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Buy Price</th>
                      </tr>
                    </thead>
                    <tbody>
{bill.products.map((product, idx) => (
  <tr key={idx}>
    <td>{product.id}</td>
    <td>{product.productName}</td>
    <td>
      <input
        type="number"
        ref={(ref) => quantityRefs.current[idx] = ref}
        onKeyDown={handleQuantityEnter}
      />
    </td>
    <td>
      <input
        type="number"
        ref={(ref) => priceRefs.current[idx] = ref}
        onKeyDown={handlePriceEnter}
      />
    </td>
  </tr>
))}

                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No bills available.</p>
        )}
      </div>
    </div>
  );
}

export default DetailedDistribution;
