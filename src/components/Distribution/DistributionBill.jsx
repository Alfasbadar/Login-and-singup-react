// DistributionBill.jsx

import React, { useRef } from 'react';
import './DistributionBill.css';

function DistributionBill({
  bill,
  index,
  onBillClick,
  onProductAdd,
  searchTerm,
  searchSuggestions,
  isSearchFocused,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  onSuggestionClick,
  searchRef
}) {
  const quantityRefs = useRef([]);

  const handleQuantityEnter = (e, idx) => {
    if (e.key === 'Enter') {
      const quantity = e.target.value;
      const product = { ...searchSuggestions[0], quantity };
      onProductAdd(product);
    }
  };

  return (
    <div className={`bill-card ${bill.expanded ? 'expanded' : ''}`} onClick={() => onBillClick(index)}>
      <div className="bill-header">
        <p>{bill.id}</p>
        <p>{bill.date}</p>
        <p>{bill.time}</p>
        <p>{bill.products.length}</p>
        <p>{bill.total}</p>
      </div>
      {bill.expanded && (
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
              ref={searchRef}
            />
            {isSearchFocused && (
              <div className="search-suggestions">
                {searchSuggestions.map((product, idx) => (
                  <div key={idx} className="suggestion" onClick={() => onSuggestionClick(product)}>
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
              {bill.products.map((product, idx) => (
                <tr key={idx}>
                  <td>{product.id}</td>
                  <td>{product.productName}</td>
                  <td>
                    <input
                      type="number"
                      ref={(ref) => quantityRefs.current[idx] = ref}
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
