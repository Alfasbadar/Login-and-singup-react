import React, { useState, useEffect, useRef } from 'react';
import './DetailedDistribution.css';
import DistributionBill from './DistributionBill';
import { distributorCreateBill, retrieveBills, deleteBill } from '../../Database/Database';
import backButton from './../../Assets/back.png';

function DetailedDistribution({ distributor, onBackClick, products }) {
  const [bills, setBills] = useState([]);
  const [newBill, setNewBill] = useState({
    id: '',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    products: [],
    total: 0,
    expanded: false,
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
      console.log('Calling bills from detailed distributor bills');
      console.log(bills, distributorBills);
    } catch (error) {
      console.error('Error loading bills:', error);
    }
  };

  const handleNewBillClick = () => {
    setShowAddBillModal(true);
  };

  const handleCreateBill = async () => {
    try {
      const createdBill = await distributorCreateBill(newBill, distributor);
      setBills([...bills, newBill]);
      setShowAddBillModal(false);
      setNewBill({
        id: '',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        products: [],
        total: 0,
        expanded: false,
      });
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  const handleAddProduct = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
      setShowAddProductModal(false);
      setNewBill((prevBill) => ({
        ...prevBill,
        products: [selectedProduct, ...prevBill.products],
      }));
    }
  };

  const handleOnBillClick = (addedProducts, billId) => {
    console.log('handle on bill click');
    console.log('bill click Detailed Distribution');
    console.log(products); // add the products inside the bill and console the bill.
    console.log(billId);
    const updatedBill = {
      ...newBill,
      products: addedProducts,
    };
    updatedBill.id = billId;
    console.log(updatedBill);
    setNewBill(updatedBill);

    // Console log the entire updated bill
    console.log('Updated Bill:', updatedBill);

    console.log(distributor.id);
    console.log(bills);

    // Delete old bill
    if (deleteBill(distributor.id, billId)) {
      console.log('Bill deleted for updation');
      if (distributorCreateBill(updatedBill, distributor)) console.log('Bill updated with products');
    }

    // Update with new bill
  };

  const handleBillClick = async (index) => {
    console.log('handleBillClick >>>');
    setSelectedBillIndex(index);
    setBills((prevBills) => {
      const updatedBills = prevBills.map((bill, i) => {
        return { ...bill, expanded: i === index ? !bill.expanded : false };
      });
      return updatedBills;
    });
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term.trim() !== '') {
      const filteredProducts = products.filter(
        (product) =>
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
        <button onClick={onBackClick} className="back-button">
          <img src={backButton} alt="Back" />
        </button>
        <div className="detailed-distributor-info">
          <h2>{distributor.name}</h2>
          <p>ID: {distributor.id}</p>
          <p>Location: {distributor.location}</p>
        </div>
      </div>
      <div className="bills">
        <div className="add-bill">
          <button onClick={handleNewBillClick} className="add-bill-button">
            + Bill
          </button>
        </div>
        {showAddBillModal && (
          <div className="detailed-modal">
            <div className="detailed-modal-content">
              <span className="detailed-close" onClick={() => setShowAddBillModal(false)}>
                &times;
              </span>
              <h2>New Bill</h2>
              <input
                type="text"
                placeholder="Enter Bill ID"
                value={newBill.id}
                onChange={(e) => setNewBill({ ...newBill, id: e.target.value })}
                className="detailed-input"
              />
              <label>Date:</label>
              <input type="text" value={newBill.date} readOnly className="detailed-input" />
              <label>Time:</label>
              <input type="text" value={newBill.time} readOnly className="detailed-input" />
              <button onClick={handleCreateBill} className="detailed-add-button">
                Create
              </button>
            </div>
          </div>
        )}
        {bills.map((bill, index) => (
          <div key={index} className="detailed-bill-card">
            <div className="detailed-bill-header" onClick={() => handleBillClick(index)}>
              <p>{bill.id}</p>
              <p>{bill.date}</p>
              <p>{bill.time}</p>
              <button className="detailed-expand-button">{bill.expanded ? '-' : '+'}</button>
            </div>
            {bill.expanded && (
              <DistributionBill
                billid={bill.id}
                bills={bills}
                index={index}
                searchTerm={searchTerm}
                searchSuggestions={searchSuggestions}
                isSearchFocused={isSearchFocused}
                onSearchChange={handleSearchChange}
                onSearchFocus={handleSearchFocus}
                onSearchBlur={handleSearchBlur}
                onSuggestionClick={handleSuggestionClick}
                searchRef={searchRef}
                products={products}
                distributor={distributor}
                onBillClick={handleOnBillClick}
              />
            )}
          </div>
        ))}
      </div>
      {showAddProductModal && (
        <div className="detailed-modal">
          <div className="detailed-modal-content">
            <span className="detailed-close" onClick={() => setShowAddProductModal(false)}>
              &times;
            </span>
            <h2>Add Product</h2>
            <input
              type="text"
              placeholder="Search and add product"
              value={searchTerm}
              onChange={handleSearchChange}
              className="detailed-input"
            />
            <div className="detailed-search-suggestions">
              {searchSuggestions.map((product, index) => (
                <div key={index} className="detailed-suggestion" onClick={() => setSelectedProduct(product)}>
                  <div>{product.id}</div>
                  <div>{product.productName}</div>
                  <div>{product.brand}</div>
                </div>
              ))}
            </div>
            <button onClick={handleAddProduct} className="detailed-add-button">
              Add Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailedDistribution;
