import React, { useRef, useState } from 'react';
import './DistributionBill.css';

function DistributionBill({
  bill,
  searchTerm,
  searchSuggestions,
  isSearchFocused,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
}) {
  const quantityRefs = useRef([]);
  const [expanded, setExpanded] = useState(false);
  const [addedProducts, setAddedProducts] = useState([]);

  const handleQuantityEnter = (e, idx) => {
    if (e.key === 'Enter') {
      const quantity = e.target.value;
      const product = { ...searchSuggestions[idx], quantity };
      setAddedProducts(prevProducts => [...prevProducts, product]);
    }
  };

  const handleToggleExpansion = () => {
    setExpanded(!expanded);
  };

  const handleSuggestionClick = (product) => {
    setAddedProducts(prevProducts => [...prevProducts, product]);
  };

  return (
    <div className={`bill-card ${expanded ? 'expanded' : ''}`}>
      <div className="bill-header">
        <p>{bill.id}</p>
        <p>{bill.date}</p>
        <p>{bill.time}</p>
        <p>{addedProducts.length}</p>
        <p>{bill.total}</p>
        <button onClick={handleToggleExpansion}>{expanded ? 'Collapse' : 'Expand'}</button>
      </div>
      {expanded && (
        <div className="bill-items">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search and add product"
              className="product-input"
              value={searchTerm}
              onChange={onSearchChange}
              onFocus={onSearchFocus}
              onBlur={onSearchBlur}
            />
            {isSearchFocused && (
              <div className="search-suggestions">
                {searchSuggestions.map((product, idx) => (
                  <div key={idx} className="suggestion" onClick={() => handleSuggestionClick(product)}>
                    <div>{product.id}</div>
                    <div>{product.brand}</div>
                    <div>{product.productName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
              {addedProducts.map((product, idx) => (
                <tr key={idx}>
                  <td>{product.id}</td>
                  <td>{product.productName}</td>
                  <td>
                    <input
                      type="number"
                      ref={ref => quantityRefs.current[idx] = ref}
                      onKeyDown={(e) => handleQuantityEnter(e, idx)}
                    />
                  </td>
                  <td>{product.buyPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DistributionBill;
