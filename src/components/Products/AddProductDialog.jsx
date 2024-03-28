import React, { useState,useEffect } from 'react';
import './Products.css'; // Import CSS file for styling
import {addProductToDatabase} from '../../Database/Database'

function AddProductDialog({onClose,onChange,product}) {
console.log(product)
const [AddProduct, isAddProduct] = useState(null)

    const [id, setId] = useState('');
    const [brand, setBrand] = useState('');
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('Nos');
    const [description,setDescription] = useState('')
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [tax, setTax] = useState('');
    const [distributorName, setDistributorName] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [variants, setVariants] = useState([]);
    const [numOtherOptions, setNumOtherOptions] = useState(0);
    const [otherOptions, setOtherOptions] = useState([]);
    const [showCard, setShowCard] = useState(true);
    const [heading,setHeading] = useState("Add Product");
    const [buttonText, setButtonText] = useState("Add")

    useEffect(() => {
        if (product !== null && product) {
            setHeading("Edit Product");
            setButtonText("Edit")
            console.log("Props contain Value which means that the component is using to edit a product")
            // Load values of the product to their appropriate fields
            isAddProduct(false);
            setId(product.id);
            setBrand(product.brand);
            setProductName(product.productName);
            setCategory(product.category);
            setQuantity(product.quantity);
            setUnit(product.unit);
            setDescription(product.description); // Corrected: Use dot instead of comma
            setBuyPrice(product.buyPrice); // Corrected: Use dot instead of comma
            setSellPrice(product.sellPrice);
            setTax(product.tax);
            setDistributorName(product.distributorName);
            setGstNo(product.gstNo);
            setVariants(product.variants);
            setOtherOptions(product.otherOptions);
        }
        else{
            console.log("Adding Product ")

        }
    }, [product]);
    
    // Function to handle adding a new variant
    const handleAddVariant = () => {
        setVariants([...variants, { name: '', variantName: '', options: [{ name: '', quantity: '', unit: '', buyPrice: '', sellPrice: '', tax: '' }] }]);
    };

    // Function to handle removing a variant by index
    const handleRemoveVariant = (index) => {
        const updatedVariants = [...variants];
        updatedVariants.splice(index, 1);
        setVariants(updatedVariants);
    };

    // Function to handle other options change
const handleOtherOptionChange = (index, field, e) => {
    const updatedOtherOptions = [...otherOptions];
    updatedOtherOptions[index][field] = e.target.value;
    setOtherOptions(updatedOtherOptions);
};


    // Function to handle adding a new option for a variant
    const handleAddOption = (variantIndex) => {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].options.push({ name: '', quantity: '', unit: '', buyPrice: '', sellPrice: '', tax: '' });
        setVariants(updatedVariants);
    };

    // Function to handle removing an option for a variant by index
    const handleRemoveOption = (variantIndex, optionIndex) => {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].options.splice(optionIndex, 1);
        setVariants(updatedVariants);
    };

    // Function to handle variant option change
    const handleOptionChange = (variantIndex, optionIndex, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].options[optionIndex][field] = value;
        setVariants(updatedVariants);
    };

    const handleCancel = () => {
        try {
            onClose();
            onChange();
        } catch (error) {
            onChange();
        }

    };

    // Function to handle variant name change
    const handleVariantNameChange = (index, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index].variantName = value;
        setVariants(updatedVariants);
    };

    // Function to handle form submission
    const handleSubmit = () => {
        // Perform form submission logic here
        const product= {
            id,
            brand,
            productName,
            category,
            description,
            quantity,
            unit,
            buyPrice,
            sellPrice,
            tax,
            distributorName,
            gstNo,
            variants,
            otherOptions
        };

        if(addProductToDatabase(product))
        console.log("Product added to database")
        else  
        console.error("Error adding product to database");

        onChange();
        console.log(product)
        // setId(id++);
        // setBrand('');
        // setProductName('');
        // setCategory('');
        // setDescription('');
        // setQuantity('');
        // setUnit('Nos');
        // setBuyPrice('');
        // setSellPrice('');
        // setTax('');
        // setDistributorName('');
        // setGstNo('');
        // setVariants([]);
        // setOtherOptions([]);
        // setNumOtherOptions(0);
    };

    return (
        <div className="product-form card">
            <h2>{heading}</h2>
            <div className="form-row">
            <div className="input-field">
                    <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div className="input-field">
                    <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                </div>
                <div className="input-field">
                    <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
                </div>
            </div>
            <div className="form-row">
                <div className="input-field">
                    <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div className="input-field">
                    <input type="text" placeholder="Quantity"  value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="input-field">
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="Nos">Nos</option>
                        <option value="Kg">Kg</option>
                        <option value="gm">gm</option>
                        <option value="Meter">Meter</option>
                        <option value="cm">cm</option>
                    </select>
                </div>
            </div>
            <div className="form-row">
                <div className="input-field">
                <input type="text-area" placeholder='Description' value={description} onChange={(e) =>setDescription(e.target.value)}/>
                </div>
            </div>
            <div className="form-row">
                <div className="input-field">
                    <input type="text" placeholder="Buy Price"  value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
                </div>
                <div className="input-field">
                    <input type="text" placeholder="Sell Price" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
                </div>
                <div className="input-field">
                    <input type="number" min="0" max="100" step="0.01" placeholder="Tax (%)" value={tax} onChange={(e)=> setTax(e.target.value)} />
                </div>
            </div>
            <div className="form-row">
                <div className="input-field">
                    <input type="text" placeholder="Distributor Name"  value={distributorName} onChange={(e) => setDistributorName(e.target.value)} />
                </div>
                <div className="input-field">
                    <input type="text" placeholder="GST No"  value={gstNo} onChange={(e) => setGstNo(e.target.value)} />
                </div>
            </div>
            <hr />
            <div className="variant-form-row">
                <label>Variants and Options</label>
                <input
                    type="number"
                    value={variants.length}
                    onChange={(e) => {
                        const numVariants = parseInt(e.target.value, 10);
                        const updatedVariants = [...variants];
                        if (numVariants > updatedVariants.length) {
                            for (let i = updatedVariants.length; i < numVariants; i++) {
                                updatedVariants.push({
                                    name: '',
                                    variantName: '',
                                    options: [{
                                        name: '',
                                        quantity: '',
                                        unit: '',
                                        buyPrice: '',
                                        sellPrice: '',
                                        tax: ''
                                    }]
                                });
                            }
                            setVariants(updatedVariants);
                        } else {
                            setVariants(updatedVariants.slice(0, numVariants));
                        }
                    }}
                    placeholder="Number of Variants"
                />
            </div>
            <div className="-variant-form-row">
                {variants.map((variant, index) => (
                    <div className="variant" key={index}>
                        <div className="variant-header">
    
                            <input
                                type="text"
                                value={variant.variantName}
                                onChange={(e) => handleVariantNameChange(index, e.target.value)}
                                placeholder="Variant Name"
                            />
                            <button className="remove-variant-button" onClick={() => handleRemoveVariant(index)}>Remove</button>
                        </div>
                        <div className="variant-options">
                            {variant.options.map((option, optionIndex) => (
                            <div className="variant-option" key={optionIndex}>
                                <div className="variant-option-input-container">
                                    <div className="option-row">
                                        <input
                                            type="text"
                                            value={option.name}
                                            onChange={(e) => handleOptionChange(index, optionIndex, 'name', e.target.value)}
                                            placeholder="Option Name"
                                        />
                                        <input
                                            type="text"
                                            value={option.quantity}
                                            onChange={(e) => handleOptionChange(index, optionIndex, 'quantity', e.target.value)}
                                            placeholder="Quantity"
                                        />
                                                            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="Nos">Nos</option>
                        <option value="Kg">Kg</option>
                        <option value="gm">gm</option>
                        <option value="Meter">Meter</option>
                        <option value="cm">cm</option>
                    </select>
                    
                 </div>
                                        <button className="option-add-button" onClick={() => handleRemoveOption(index, optionIndex)}>-</button>
                                    </div>
                                    <div className="variant-options ">
                                <div className="variant-option-input-container">
                                    <div className="option-row">


                                        <input
                                            type="text"
                                            value={option.buyPrice}
                                            onChange={(e) => handleOptionChange(index, optionIndex, 'buyPrice', e.target.value)}
                                            placeholder="Buy Price"
                                            />
                                        <input
                                            type="text"
                                            value={option.sellPrice}
                                            onChange={(e) => handleOptionChange(index, optionIndex, 'sellPrice', e.target.value)}
                                            placeholder="Sell Price"
                                            />
                                        <input
                                            type="text"
                                            value={option.gstNo}
                                            onChange={(e) => handleOptionChange(index, optionIndex, 'GST No', e.target.value)}
                                            placeholder="Gst No"
                                            />
                                            </div>
                                    </div>
                                            </div>
                                    <div className="option-row">
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="option-buttons-remove-button" onClick={() => handleAddOption(index)}>+ fields</button>
                        <hr/>
                    </div>
                ))}
            </div>
            <div className="form-buttons">
                <button onClick={handleSubmit} className="btn-add">{buttonText}</button>
                <button onClick={handleCancel} className="btn-cancel">Cancel</button>
            </div>
        </div>
    );
    
}

export default AddProductDialog;
