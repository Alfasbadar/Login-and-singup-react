import React, { useState, useEffect } from 'react';
import './AddProductDialog.css'; // Import CSS file
import { addProductToDatabase, getUserEmail } from '../../Database/Database'; // Import Firebase functions

const AddProductDialog = ({ onClose }) => {
  const [productDetails, setProductDetails] = useState({
    id: '',
    brand: '',
    type: '',
    name: '',
    description: '',
    quantity: '',
    unit: 'Nos', // Default unit
    buyPrice: '',
    sellPrice: '',
    expiry: '',
    distributorVisible: false,
    distributorName: '',
    distributorPhone: '',
    profit: 0, // Default profit
    variants: [{ type: '', attribute: '', buyPrice: '', sellPrice: '', profit: 0 }] // Initialize with an empty variant
  });

  useEffect(() => {
    // Fetch user email if not provided
    const fetchUserEmail = async () => {
      const userEmail = await getUserEmail();
      setProductDetails(prevState => ({
        ...prevState,
        userEmail: userEmail
      }));
    };
    if (!productDetails.userEmail) {
      fetchUserEmail();
    }
  }, [productDetails.userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails(prevState => ({
      ...prevState,
      [name]: value,
      profit: (name === 'buyPrice' || name === 'sellPrice') ? calculateProfit(value, prevState.sellPrice) : prevState.profit
    }));
  };

  const handleToggleDistributor = () => {
    setProductDetails(prevState => ({
      ...prevState,
      distributorVisible: !prevState.distributorVisible
    }));
  };

  const handleAddVariant = () => {
    setProductDetails(prevState => ({
      ...prevState,
      variants: [...prevState.variants, { type: '', attribute: '', buyPrice: '', sellPrice: '' }]
    }));
  };

  const handleRemoveVariant = (index) => {
    setProductDetails(prevState => ({
      ...prevState,
      variants: prevState.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const [fieldName, fieldIndex] = name.split('_');
    const updatedVariants = [...productDetails.variants];
    updatedVariants[index][fieldName] = value;

    if (fieldName === 'buyPrice' || fieldName === 'sellPrice') {
      updatedVariants[index].profit = calculateProfit(value, updatedVariants[index].sellPrice);
    }

    setProductDetails(prevState => ({
      ...prevState,
      variants: updatedVariants
    }));
  };

const calculateProfit = (buyPrice, sellPrice) => {
  if (!isNaN(buyPrice) && !isNaN(sellPrice)) {
    return (sellPrice - buyPrice);
  } else {
    return '';
  }
};

  const handleSave = async () => {
    // Check if required fields are empty
    if (!productDetails.id || !productDetails.type || !productDetails.name || !productDetails.description || !productDetails.sellPrice) {
      alert('Please fill in all required fields: ID, Type, Name, Description, and Selling Price');
      return;
    }

    console.log('Adding product to database');
    const status = await addProductToDatabase(productDetails); // Wait for the result of addProductToDatabase

    if (status) {
      console.log("Product added");
      onClose();
    } else {
      console.log("Product add failed");
    }
  };

  const handleCancel = () => {
    onClose(); // Close the dialog without saving
  };

  return (
    <div className="add-product-dialog">
      <div className="dialog-header">
        <h2 className="dialog-title">Add Product</h2>
        <button className="close-button" onClick={handleCancel}>X</button>
      </div>
      <div className="input-grid">
        <div className="input-row">
          <input type="text" name="id" value={productDetails.id} onChange={handleChange} placeholder="ID" className="input-field" />
          <input type="text" name="brand" value={productDetails.brand} onChange={handleChange} placeholder="Brand" className="input-field" />
          <input type="text" name="type" value={productDetails.type} onChange={handleChange} placeholder="Type" className="input-field" />
        </div>
        <div className="input-row">
          <input type="text" name="name" value={productDetails.name} onChange={handleChange} placeholder="Name" className="input-field" />
          <input type="number" name="quantity" value={productDetails.quantity} onChange={handleChange} placeholder="Quantity" className="input-field" />
          <select name="unit" value={productDetails.unit} onChange={handleChange} className="input-field">
            <option value="Nos">Nos</option>
            <option value="kg">kg</option>
            <option value="gm">gm</option>
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="inch">inch</option>
          </select>
        </div>
        <div className="input-row">
          <input type="text" name="buyPrice" value={productDetails.buyPrice} onChange={handleChange} placeholder="BP" className="input-field" />
          <input type="text" name="sellPrice" value={productDetails.sellPrice} onChange={handleChange} placeholder="SP" className="input-field" />
          <input type="text" value={productDetails.profit} readOnly placeholder="Profit" className="input-field" />
        </div>
        <div className="input-row">
          <textarea rows="4" name="description" value={productDetails.description} onChange={handleChange} placeholder="Description" className="input-field"></textarea>
        </div>
        <div className="input-row">
          <input type="text" name="expiry" value={productDetails.expiry} onChange={handleChange} placeholder="Expiry (dd/mm/yyyy)" maxLength="10" className="input-field" />
        </div>
        <div className="input-row">
          <button className="distributor-button" onClick={handleToggleDistributor}>{productDetails.distributorVisible ? "Hide Distributor" : "Show Distributor"}</button>
        </div>
        {productDetails.distributorVisible && (
          <div className="input-row">
            <input type="text" name="distributorName" value={productDetails.distributorName} onChange={handleChange} placeholder="Distributor Name" className="input-field" />
            <input type="text" name="distributorPhone" value={productDetails.distributorPhone} onChange={handleChange} placeholder="Distributor Phone" className="input-field" />
          </div>
        )}
        <div className="input-row">
          <button className="add-variant-button" onClick={handleAddVariant}>+ Variant</button>
        </div>
        {productDetails.variants.map((variant, index) => (
          <div key={index} className="variant-row">
            <div className="variant-type-attribute">
              <input type="text" name={`type_${index}`} value={variant.type} onChange={(e) => handleVariantChange(index, e)} placeholder="Variant Type" className="input-field" />
              <input type="text" name={`attribute_${index}`} value={variant.attribute} onChange={(e) => handleVariantChange(index, e)} placeholder="Variant Attribute" className="input-field" />
            </div>
            <div className="variant-bp-sp-profit">
              <input type="text" name={`buyPrice_${index}`} value={variant.buyPrice} onChange={(e) => handleVariantChange(index, e)} placeholder="Variant BP" className="input-field" />
              <input type="text" name={`sellPrice_${index}`} value={variant.sellPrice} onChange={(e) => handleVariantChange(index, e)} placeholder="Variant SP" className="input-field" />
              <input type="text" value={variant.profit} readOnly placeholder="Variant Profit" className="input-field" />
              <button className="remove-variant-button" onClick={() => handleRemoveVariant(index)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="button-container">
        <button className="save-button" onClick={handleSave}>Add</button>
        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
        }

        export default AddProductDialog