import React, { useState, useEffect } from 'react';
import './Products.css';
import AddProductDialog from './AddProductDialog';
import { getAllProducts } from '../../Database/Database';

const Products = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products data when component mounts
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch products data from Firestore
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAdd = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
        <div className="card-button" onClick={handleAdd}>
          +
        </div>
      </div>
      {isDialogOpen && <AddProductDialog onClose={handleCloseDialog} />}
      <div className="product-container">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <div>ID: {product.id}</div>
            <div>Brand: {product.brand}</div>
            <div>Category: {product.category}</div>
            <div>Name: {product.name}</div>
            <div>Quantity: {product.quantity}</div>
            <div>Price: {product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
