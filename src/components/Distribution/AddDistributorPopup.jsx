import React, { useState } from 'react';
// import './AddDistributorPopup.css'; // Import or create CSS for styling

const AddDistributorPopup = ({ onClose, onSubmit }) => {
  const [newDistributor, setNewDistributor] = useState({
    id: '',
    name: '',
    contact: '',
    comments: ''
  });

  const handleChange = (e) => {
    setNewDistributor({ ...newDistributor, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(newDistributor);
    setNewDistributor({
      id: '',
      name: '',
      contact: '',
      comments: ''
    });
  };

  return (
    <div className="adddistributor-popup-overlay">
      <div className="adddistributor-popup-content">
        <span className="adddistributor-close" onClick={onClose}>
          &times;
        </span>
        <h2>Add Distributor</h2>
        <input
          type="text"
          name="id"
          placeholder="ID"
          value={newDistributor.id}
          onChange={handleChange}
          className="adddistributor-input-field"
        />
        <input
          type="text"
          name="name"
          placeholder="Distributor Name"
          value={newDistributor.name}
          onChange={handleChange}
          className="adddistributor-input-field"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={newDistributor.contact}
          onChange={handleChange}
          className="adddistributor-input-field"
        />
        <input
          type="text"
          name="comments"
          placeholder="Comments"
          value={newDistributor.comments}
          onChange={handleChange}
          className="adddistributor-input-field"
        />
        <div className="adddistributor-button-container">
          <button className="adddistributor-add" onClick={handleSubmit}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDistributorPopup;
