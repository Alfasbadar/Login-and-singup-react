import React, { useState, useRef,useEffect } from 'react';
import './DistributionBill.css';

function DistributionBill({ products, distributor }) {
  const [addedProducts, setAddedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showOptions, setShowOptions] = useState(false);

  const nameRef = useRef(null);
  const quantityRef = useRef(null);
  const priceRef = useRef(null);

  const handleNameChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    // Filter products based on search term
    const results = value ? products.filter(product =>
      product.productName.toLowerCase().includes(value.toLowerCase()) ||
      product.id.toLowerCase().includes(value.toLowerCase()) ||
      product.brand.toLowerCase().includes(value.toLowerCase()) ||
      product.category.toLowerCase().includes(value.toLowerCase())
    ) : [];
    setSearchResults(results);
    setSelectedSuggestionIndex(-1);
  };

  const handleSuggestionClick = (product) => {
    nameRef.current.value = product.productName;
    // Set only product name and ID, leave quantity and price empty
    // setAddedProducts([...addedProducts, { id: product.id, productName: product.productName, quantity: '', price: '' }]);
    setSearchTerm('');
    setSearchResults([]);
    setSelectedSuggestionIndex(-1);
    quantityRef.current.focus();
  };

  const handleQuantityKeyDown = (e) => {
    if (e.key === 'Enter') {
      priceRef.current.focus();
    }
  };

  const handlePriceKeyDown = (e) => {
    if (e.key === 'Enter') {
      addProduct();
    }
  };

  const addProduct = () => {
    const newProduct = {
      id: addedProducts.length + 1,
      productName: nameRef.current.value,
      quantity: quantityRef.current.value,
      price: priceRef.current.value
    };
    setAddedProducts([...addedProducts, newProduct]);
    // Clear input fields for the next entry
    nameRef.current.value = '';
    quantityRef.current.value = '';
    priceRef.current.value = '';
    nameRef.current.focus();
  };

  const handleSuggestionHover = (index) => {
    setSelectedSuggestionIndex(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prevIndex => Math.min(prevIndex + 1, searchResults.length - 1));
    } else if (e.key === 'Enter' && selectedSuggestionIndex !== -1) {
      handleSuggestionClick(searchResults[selectedSuggestionIndex]);
    }
  };

  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const handleBillClick = async () => {
    console.log("handle bill click")
    try {
      const newBill = {
        id: '', // Include the bill ID
        date: new Date().toLocaleDateString(), // Include the current date
        time: new Date().toLocaleTimeString(), // Include the current time
        products: addedProducts,
        total: 0 // Calculate the total price
      };

      // Call the function to handle bill creation
      // const createdBill = await handleCreateBill(newBill, distributor);

      // console.log('Bill created:', createdBill);
      
      // Clear addedProducts state after successful creation
      setAddedProducts([]);
    } catch (error) {
      console.error('Error creating bill:', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  return (
    <div className="distribution-bill">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {addedProducts.map((product, idx) => (
            <tr key={idx}>
              <td>{product.id}</td>
              <td>{product.productName}</td>
              <td>{product.quantity}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="input-row">
        <input
          type="text"
          placeholder="Enter product name or ID"
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          ref={nameRef}
        />
        <input
          type="text"
          placeholder="Enter quantity"
          onKeyDown={handleQuantityKeyDown}
          ref={quantityRef}
        />
        <input
          type="text"
          placeholder="Enter price"
          onKeyDown={handlePriceKeyDown}
          ref={priceRef}
        />
      </div>
      {addedProducts.length > 0 && (
        <div className="bill-products-section">
            <div className="options">
              <button onClick={handleBillClick}>Bill</button>
            </div>
        </div>
      )}
      {searchTerm && (
        <div className="search-results">
          {searchResults.map((product, index) => (
            <div
              key={index}
              className={`suggestion ${selectedSuggestionIndex === index ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(product)}
              onMouseEnter={() => handleSuggestionHover(index)}
            >
              <span>{product.id}</span>
              <span>{product.productName}</span>
              <span>{product.brand}</span>
              <span>{product.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DistributionBill;
