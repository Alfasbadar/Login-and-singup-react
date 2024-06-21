import React, { useState, useEffect } from 'react';
import './Products.css';
import AddProductDialog from './AddProductDialog';
import { getAllProducts, removeProductFromDatabase } from '../../Database/Database';

const Products = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id'); // Default sort field
  const [sortDirection, setSortDirection] = useState('asc'); // Default sort direction
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchSuggestions.length > 0) {
      handleSelectProduct(searchSuggestions[0]);
    }
  };

  const handleSelectProduct = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setSearchTerm('');
    setSearchSuggestions([]);
    setShowSearchBar(false); // Hide search bar after selection, adjust as per UI/UX
    setShowAddProductForm(false); // Reset any form visibility state
    setShowAddProductForm(true); // Adjust if necessary based on product details
  };

  const handleAdd = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditOpen(false);
    fetchProducts();
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Filter products based on search term
    const filteredProducts = products.filter(product => {
      return (
        product.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Add other fields as needed for search
        product.distributorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setSearchSuggestions(filteredProducts);
  };

  const handleSearch = () => {
    // Implement further actions when searching (optional)
    console.log("Handling Search");
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (productId) => {
    if (await removeProductFromDatabase(productId)) {
      console.log("Product removed successfully");
      fetchProducts();
    } else {
      console.log("Error in removing product");
    }
  };

  const handleEdit = (id) => {
    const selectedProduct = products.find(product => product.id === id);

    if (selectedProduct) {
      console.log("Selected product:", selectedProduct);
      setProductToEdit(selectedProduct);
      setEditOpen(true);
    } else {
      console.log("Product not found with id:", id);
    }
  };

  const compareValues = (key, order = 'asc') => {
    return function(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
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

  const sortedProducts = [...products].sort(compareValues(sortField, sortDirection));

  const getSortedHeaderClass = (field) => {
    if (field === sortField) {
      return sortDirection === 'asc' ? 'sorted-header-down' : 'sorted-header-up';
    }
    return '';
  };

  return (
    <div className="product-products-container">
      <div className="header">
        <div className={`search-bar-container ${showSearchBar ? 'active' : ''}`}>
          <input
            type="text"
            placeholder="Search product"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className={showSearchBar ? 'visible' : ''}
          />
          <button onClick={() => setShowSearchBar(!showSearchBar)}>
            {showSearchBar ? 'Cancel' : 'Search'}
          </button>
        </div>
        {showSearchBar && (
          <div className="search-suggestions">
            {searchSuggestions.map((product, index) => (
              <div
                key={index}
                className="suggestion"
                onClick={() => handleSelectProduct(product)}
              >
                {product.productName} {/* Display relevant information */}
              </div>
            ))}
            {searchSuggestions.length === 0 && searchTerm && (
              <div className="create-new" onClick={handleAdd}>
                Create new Product
              </div>
            )}
          </div>
        )}
      </div>
      <div className="product-total-products">Total Products: {products.length}


      </div>
      <table className="product-product-table">
        <thead>
          <tr>
            <th className={`header-item ${getSortedHeaderClass('id')}`} onClick={() => handleSort('id')}>
              ID {sortField === 'id' && (sortDirection === 'asc' ? '↓' : '↑')}
            </th>
            <th className={`header-item ${getSortedHeaderClass('brand')}`} onClick={() => handleSort('brand')}>
              Brand {sortField === 'brand' && (sortDirection === 'asc' ? '↓' : '↑')}
            </th>
            <th className={`header-item ${getSortedHeaderClass('productName')}`} onClick={() => handleSort('productName')}>
              Name {sortField === 'productName' && (sortDirection === 'asc' ? '↓' : '↑')}
            </th>
            <th className={`header-item ${getSortedHeaderClass('quantity')}`} onClick={() => handleSort('quantity')}>
              Quantity {sortField === 'quantity' && (sortDirection === 'asc' ? '↓' : '↑')}
            </th>
            <th className={`header-item ${getSortedHeaderClass('sellPrice')}`} onClick={() => handleSort('sellPrice')}>
              Price {sortField === 'sellPrice' && (sortDirection === 'asc' ? '↓' : '↑')}
            </th>
            <th className={`header-item ${getSortedHeaderClass('distributorName')}`} onClick={() => handleSort('distributorName')}>
              Distributor {sortField === 'distributorName' && (sortDirection === 'asc' ? '↓' : '↑')}
            </th>
            <th className="header-item">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.brand}</td>
              <td>{product.productName}</td>
              <td>{product.quantity}</td>
              <td>{product.sellPrice}</td>
              <td>{product.distributorName}</td>
              <td>
                <div className="product-dropdown">
                  <button className="product-dropbtn">⋮</button>
                  <div className="product-dropdown-content">
                    <button className="edit-product-button" onClick={() => handleEdit(product.id)}>Edit</button>
                    <button className="remove-product-button" onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-product-button" onClick={handleAdd}>
                    + Add Product
                </button>
      {isDialogOpen && <AddProductDialog onClose={handleCloseDialog} onChange={fetchProducts} />}
      {isEditOpen && <AddProductDialog onClose={handleCloseDialog} onChange={fetchProducts} product={productToEdit} />}
    </div>
  );
};

export default Products;
