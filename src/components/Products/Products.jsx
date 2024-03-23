import React, { useState, useEffect } from 'react';
import './Products.css';
import AddProductDialog from './AddProductDialog';
import { getAllProducts } from '../../Database/Database';

const Products = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id'); // Default sort field
  const [sortDirection, setSortDirection] = useState('asc'); // Default sort direction

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    console.log("Handling Search");
    // Implement search logic here
  };

  const handleSort = (field) => {
    if (field === sortField) {
      // If already sorting by the same field, reverse the order
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sort by the new field in ascending order by default
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Function to compare objects based on field for sorting
  const compareValues = (key, order = 'asc') => {
    return function(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // Property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }

      return order === 'desc' ? comparison * -1 : comparison;
    };
  };

  // Sort products based on the selected field and direction
  const sortedProducts = [...products].sort(compareValues(sortField, sortDirection));

  // Determine classes for sorted header
  const getSortedHeaderClass = (field) => {
    if (field === sortField) {
      return sortDirection === 'asc' ? 'sorted-header-down' : 'sorted-header-up';
    }
    return '';
  };

  return (
    <div className="products-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <button className="add-product-button" onClick={handleAdd}>
          + Add Product
        </button>
      </div>
      <div className="total-products">Total Products: {products.length}</div>
      <div className="product-list-header">
        <div className={`header-item ${getSortedHeaderClass('id')}`} onClick={() => handleSort('id')}>
          ID {sortField === 'id' && (sortDirection === 'asc' ? '↓' : '↑')}
        </div>
        <div className={`header-item ${getSortedHeaderClass('brand')}`} onClick={() => handleSort('brand')}>
          <b>Brand</b> {sortField === 'brand' && (sortDirection === 'asc' ? '↓' : '↑')}
        </div>
        <div className={`header-item ${getSortedHeaderClass('name')}`} onClick={() => handleSort('name')}>
          <b>Name</b> {sortField === 'name' && (sortDirection === 'asc' ? '↓' : '↑')}
        </div>
        <div className={`header-item ${getSortedHeaderClass('quantity')}`} onClick={() => handleSort('quantity')}>
          Quantity {sortField === 'quantity' && (sortDirection === 'asc' ? '↓' : '↑')}
        </div>
        <div className={`header-item ${getSortedHeaderClass('price')}`} onClick={() => handleSort('price')}>
          <b>Price</b> {sortField === 'price' && (sortDirection === 'asc' ? '↓' : '↑')}
        </div>
        <div className={`header-item ${getSortedHeaderClass('distributorName')}`} onClick={() => handleSort('distributorName')}>
          Distributor Name {sortField === 'distributorName' && (sortDirection === 'asc' ? '↓' : '↑')}
        </div>
      </div>
      <div className="product-list">
        {sortedProducts.map(product => (
          <div className="product-card" key={product.id}>
            <div>{product.id}</div>
            <div>{product.brand}</div>
            <div>{product.name}</div>
            <div>{product.quantity}</div>
            <div>{product.price}</div>
            <div>{product.distributorName}</div>
          </div>
        ))}
      </div>
      {isDialogOpen && <AddProductDialog onClose={handleCloseDialog} />}
    </div>
  );
};

export default Products;
