import React, { useState, useEffect } from 'react';
import './Products.css';
import AddProductDialog from './AddProductDialog';
import { getAllProducts, removeProductFromDatabase } from '../../Database/Database';

const Products = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditOpen, setEditOpen] = useState(false);
    const [productToEdit,setProductToEdit] = useState(null)

    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        fetchProducts();
    }, []);


    const handleEdit = (id) => {
      // Find the product with the matching id

      console.log("edit clicked")
      const selectedProduct = products.find(product => product.id === id);
    
      if (selectedProduct) {
        console.log("Selected product:", selectedProduct);
        setProductToEdit(selectedProduct);
        setEditOpen(true);
        
      } else {
        console.log("Product not found with id:", id);
      }
    }
    const fetchProducts = async () => {
        try {
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
      setEditOpen(false);
      fetchProducts();  
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
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const updateView = () => {
      fetchProducts();
    }

    const handleDelete = (productId) => {
        if (removeProductFromDatabase(productId)) {
            console.log("Removed ");
            fetchProducts();
        } else {
            console.log("Error in removing");
        }
    };

    const getSortedHeaderClass = (field) => {
      if (sortField === field) {
          return sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc';
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
            <table className="product-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')} className={`header-item ${getSortedHeaderClass('id')}`}>
                            ID {sortField === 'id' && (sortDirection === 'asc' ? '↓' : '↑')}
                        </th>
                        <th>Brand</th>
                        <th>ProductName</th>
                        <th>Quantity</th>
                        <th>Buy Price</th>
                        <th>Sell Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    {products.map(product => (
        <React.Fragment key={product.id}>
            <tr>
                <td>{product.id}</td>
                <td>{product.brand}</td>
                <td>{product.productName}</td>
                <td>{product.quantity}</td>
                <td>{product.buyPrice}</td>
                <td>{product.sellPrice}</td>
                <td>
                {/* <button className="edit-button" onClick={() => handleEdit(product.id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button> */}
                </td>
            </tr>
            {product.generatedVariants && product.generatedVariants.map((variant, index) => (
                <tr key={`${product.id}-${index}`}>
                    <td></td>
                    <td></td>
                    <td>{variant.SIZE}</td>
                    <td>{variant.quantity || product.quantity}</td>
                    <td>{variant.buyPrice || product.buyPrice}</td>
                    <td>{variant.sellPrice || product.sellPrice}</td>
                    <td>
                    <button className="edit-button" onClick={() => handleEdit(product.id)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
                    </td>
                </tr>
            ))}
        </React.Fragment>
    ))}
</tbody>
            </table>
            {isDialogOpen && <AddProductDialog onClose={handleCloseDialog} />}
            {isEditOpen && <AddProductDialog onClose={handleCloseDialog} onChange={updateView} product={productToEdit} />}

        </div>
    );
};

export default Products;
