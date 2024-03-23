import React, { useState, useEffect } from 'react';
import './Products'; // Import CSS file
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
    bp: '', // Buy price
    sp: '', // Sell price
    expiry: '',
    distributorVisible: false,
    distributorName: '',
    distributorPhone: '',
    profit: 0, // Default profit
    variants: [] // Initialize with an empty array
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
    if (name === 'bp' || name === 'sp') {
      setProductDetails(prevState => ({
        ...prevState,
        [name]: value,
        profit: calculateProfit(value, prevState.sp)
      }));
    } else {
      setProductDetails(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
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
      variants: [...prevState.variants, { name: '', options: [] }] // Add a new variant with an empty name and options
    }));
  };

  const handleRemoveVariant = (index) => {
    setProductDetails(prevState => ({
      ...prevState,
      variants: prevState.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantNameChange = (index, value) => {
    const updatedVariants = [...productDetails.variants];
    updatedVariants[index].name = value;
    setProductDetails(prevState => ({
      ...prevState,
      variants: updatedVariants
    }));
  };

  const handleAddOption = (vIndex) => {
    const updatedVariants = [...productDetails.variants];
    updatedVariants[vIndex].options.push({ name: '', bp: '', sp: '', profit: 0 }); // Add a new option with empty fields
    setProductDetails(prevState => ({
      ...prevState,
      variants: updatedVariants
    }));
  };

  const handleRemoveOption = (vIndex, oIndex) => {
    const updatedVariants = [...productDetails.variants];
    updatedVariants[vIndex].options.splice(oIndex, 1); // Remove the selected option
    setProductDetails(prevState => ({
      ...prevState,
      variants: updatedVariants
    }));
  };

  const handleOptionChange = (vIndex, oIndex, field, value) => {
    const updatedVariants = [...productDetails.variants];
    updatedVariants[vIndex].options[oIndex][field] = value;
    if (field === 'bp' || field === 'sp') {
      updatedVariants[vIndex].options[oIndex].profit = calculateProfit(value, updatedVariants[vIndex].options[oIndex].sp);
    }
    setProductDetails(prevState => ({
      ...prevState,
      variants: updatedVariants
    }));
  };

  const calculateProfit = (bp, sp) => {
    if (!isNaN(bp) && !isNaN(sp)) {
      return sp - bp;
    } else {
      return '';
    }
  };

  const handleSave = async () => {
    // Check if required fields are empty
    if (!productDetails.id || !productDetails.type || !productDetails.name || !productDetails.description || !productDetails.sp) {
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
          <input type="text" name="bp" value={productDetails.bp} onChange={handleChange} placeholder="BP" className="input-field" />
          <input type="text" name="sp" value={productDetails.sp} onChange={handleChange} placeholder="SP" className="input-field" />
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
        {productDetails.variants.map((variant, vIndex) => (
          <div key={vIndex}>
            <div className="input-row">
              <input type="text" value={variant.name} onChange={(e) => handleVariantNameChange(vIndex, e.target.value)} placeholder="Variant Name" className="input-field" />
              <button className="remove-variant-button" onClick={() => handleRemoveVariant(vIndex)}>- Variant</button>
            </div>
            {variant.options.map((option, oIndex) => (
              <div key={oIndex} className="input-row">
                <input type="text" value={option.attribute} onChange={(e) => handleOptionChange(vIndex, oIndex, 'attribute', e.target.value)} placeholder="Attribute" className="input-field" />
                <input type="text" value={option.bp} onChange={(e) => handleOptionChange(vIndex, oIndex, 'bp', e.target.value)} placeholder="BP" className="input-field" />
                <input type="text" value={option.sp} onChange={(e) => handleOptionChange(vIndex, oIndex, 'sp', e.target.value)} placeholder="SP" className="input-field" />
                <button className="remove-variant-button" onClick={() => handleRemoveOption(vIndex, oIndex)}>-</button>
              </div>
            ))}
            <div className="input-row">
              <button className="add-variant-button" onClick={() => handleAddOption(vIndex)}>+ Option</button>
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
};

export default AddProductDialog;