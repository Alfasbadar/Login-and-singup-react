import React, { useState } from 'react';
import './Products.css';
import AddProductDialog from './AddProductDialog';

const Products = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleAdd = () => {
    setIsDialogOpen(true);
    setIsButtonClicked(true); // Set button state to clicked
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsButtonClicked(false); // Reset button state
  };

  const handleSearch = () => {
    console.log("Handling Search");
  };

  return (
    <div className="professional-component">
      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-bar" />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="button-container">
        <div 
          className={`card-button ${isButtonClicked ? 'clicked' : ''}`} 
          onClick={handleAdd}
        >
          +
        </div>
      </div>
      {isDialogOpen && <AddProductDialog onClose={handleCloseDialog} />}
    </div>
  );
};

export default Products;
