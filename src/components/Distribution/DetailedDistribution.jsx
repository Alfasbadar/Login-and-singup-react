import React, { useState } from 'react';
import './DetailedDistribution.css';

function DetailedDistribution({ distributor, onBackClick }) {
  const [bills, setBills] = useState([]);
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [newBill, setNewBill] = useState({
    id: '',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    products: [],
    total: 0
  });

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

  const handleProductAdd = () => {
    // Implement product adding logic here
  };

  const handleBillClick = (index) => {
    const updatedBills = bills.map((bill, i) => {
      if (i === index) {
        return { ...bill, expanded: !bill.expanded };
      }
      return bill;
    });
    setBills(updatedBills);
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
            <div key={index} className={`bill-card ${bill.expanded ? 'expanded' : ''}`} onClick={() => handleBillClick(index)}>
              <div className="bill-header">
                <p>{bill.id}</p>
                <p>{bill.date}</p>
                <p>{bill.time}</p>
                <p>{bill.products.length}</p>
                <p>{bill.total}</p>
              </div>
              {bill.expanded && (
                <div className="bill-items">
                  <input type="text" placeholder="Search and add product" className="product-input" />
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
                          <td>{product.name}</td>
                          <td>{product.quantity}</td>
                          <td>{product.buyPrice}</td>
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
