import React, { useState, useEffect } from 'react';
import './Products.css';
import AddProductDialog from './AddProductDialog';
import { getAllProducts, removeProductFromDatabase } from '../../Database/Database';
import VariantDisplay from './VariantDisplay';

const Products = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditOpen, setEditOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (id) => {
        const selectedProduct = products.find(product => product.id === id);

        if (selectedProduct) {
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
            {isDialogOpen && <AddProductDialog onClose={handleCloseDialog} />}
            {isEditOpen && <AddProductDialog onClose={handleCloseDialog} onChange={updateView} product={productToEdit} />}
            {products.map(product => (
                <div key={product.id}>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>ID {product.id}</th>
                                <th>{product.brand}</th>
                                <th>{product.productName}</th>
                                <th> Variants : {product.variants.length}</th>
                                <th>Combinations : {product.generatedVariants.length}</th>
                                <th>other</th>
                            <th>
                                <button className="edit-button" onClick={() => handleEdit(product.id)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
                            </th>
                            </tr>
                        </thead>
                        {/* <tbody>
                            <tr>
                                <td>{product.id}</td>
                                <td>{product.brand}</td>
                                <td>{product.productName}</td>
                                <td>{product.quantity}</td>
                                <td>{product.buyPrice}</td>
                                <td>{product.sellPrice}</td>
                            </tr>
                        </tbody> */}
                    </table>
                    <table className="variant-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Brand</th>
                                <th>Product</th>
                                {product.variants.map((variant, variantIndex) => (
                                    <th key={variantIndex}>{variant.variantName}</th>
                                ))}
                                <th>Quantity</th>
                                <th>Buy Price</th>
                                <th>Sell Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.generatedVariants && product.generatedVariants.map((variant, index) => (
                                <tr key={index}>
                                    <td>{product.id}</td>
                                    <td>{product.brand}</td>

                                    <td>{product.productName}</td>

                                    {product.variants.map((productVariant, variantIndex) => (
                                        <td key={`${product.id}-${index}-${variantIndex}`}>
                                            {variant[productVariant.variantName]}
                                        </td>
                                    ))}
                                    <td>{variant.quantity || product.quantity}</td>
                                    <td>{variant.buyPrice || product.buyPrice}</td>
                                    <td>{variant.sellPrice || product.sellPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
    
};

export default Products;
