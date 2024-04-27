import React, { useState, useRef, useEffect } from 'react';
import './AddProductDialog.css';
import VariantDisplay from './VariantDisplay';
import { addProductToDatabase, editProducts } from '../../Database/Database';

function AddProductDialog({ onClose, onChange, product }) {
    const [newVariant, setNewVariant] = useState('');
    const [variants, setVariants] = useState([]);
    const [variantDisplayVisible, setVariantDisplayVisible] = useState(false);
    const variantInputRefs = useRef([]);

    const [id, setId] = useState('');
    const [brand, setBrand] = useState('');
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('Nos');
    const [description, setDescription] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [tax, setTax] = useState('');
    const [distributorName, setDistributorName] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [heading, setHeading] = useState('Add Product');
    const [buttonText, setButtonText] = useState('Add');
    const [generatedVariants, setGeneratedVariants] = useState(null);

    useEffect(() => {
        if (product !== null && product) {
            setHeading('Edit Product');
            setButtonText('Edit');
            setId(product.id);
            setBrand(product.brand);
            setProductName(product.productName);
            setCategory(product.category);
            setQuantity(product.quantity);
            setUnit(product.unit);
            setDescription(product.description);
            setBuyPrice(product.buyPrice);
            setSellPrice(product.sellPrice);
            setTax(product.tax);
            setDistributorName(product.distributorName);
            setGstNo(product.gstNo);
            setVariants(product.variants);
            setGeneratedVariants(product.generatedVariants);
        } else {
            console.log("Adding Product");
        }
    }, [product]);

    const handleAddVariant = () => {
        const newVariantInputRefs = [...variantInputRefs.current, []];
        variantInputRefs.current = newVariantInputRefs;
        setVariants([...variants, { variantName: newVariant, options: [{ name: '' }] }]);
        setNewVariant('');
    };

    const handleRemoveVariant = (index) => {
        const updatedVariants = [...variants];
        updatedVariants.splice(index, 1);
        setVariants(updatedVariants);
        const newVariantInputRefs = [...variantInputRefs.current];
        newVariantInputRefs.splice(index, 1);
        variantInputRefs.current = newVariantInputRefs;
    };

    const handleAddOption = (variantIndex) => {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].options.push({ name: '' });
        setVariants(updatedVariants);

        const lastIndex = updatedVariants[variantIndex].options.length - 1;
        const optionInputRef = variantInputRefs.current[variantIndex][lastIndex];
        if (optionInputRef && optionInputRef.current) {
            optionInputRef.current.focus();
        }
    };

    const handleRemoveOption = (variantIndex, optionIndex) => {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].options.splice(optionIndex, 1);
        setVariants(updatedVariants);
    };

    const handleVariantInputChange = (e) => {
        if (e.key === 'Enter') {
            handleAddVariant();
        } else {
            setNewVariant(e.target.value);
        }
    };

    const handleOptionInputChange = (variantIndex, optionIndex, e) => {
        if (e.key === 'Enter') {
            handleAddOption(variantIndex);
        } else {
            const updatedVariants = [...variants];
            updatedVariants[variantIndex].options[optionIndex].name = e.target.value;
            setVariants(updatedVariants);
        }
    };

    const handleSubmit = () => {
        const productData = {
            id,
            brand,
            productName,
            category,
            quantity,
            unit,
            description,
            buyPrice,
            sellPrice,
            tax,
            distributorName,
            gstNo,
            variants,
            generatedVariants
        };

        if (buttonText === 'Edit') {
            editProducts(productData);
        } else {
            addProductToDatabase(productData);
        }

        onClose();
        onChange();
    };

    const handleSaveVariants = (generatedVariants) => {
        setGeneratedVariants(generatedVariants);
    };

    const generateCombinations = () => {
        const combinations = [];
        const recursion = (index, current) => {
            if (index === variants.length) {
                combinations.push(current);
                return;
            }
            variants[index].options.forEach((option) => {
                recursion(index + 1, [...current, { [variants[index].variantName]: option.name }]);
            });
        };
        recursion(0, []);
        setVariantDisplayVisible(true);
    };

    return (
        <div>
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
                        <input type="text" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
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
                        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-field">
                        <input type="text" placeholder="Buy Price" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
                    </div>
                    <div className="input-field">
                        <input type="text" placeholder="Sell Price" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
                    </div>
                    <div className="input-field">
                        <input type="number" min="0" max="100" step="0.01" placeholder="Tax (%)" value={tax} onChange={(e) => setTax(e.target.value)} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-field">
                        <input type="text" placeholder="Distributor Name" value={distributorName} onChange={(e) => setDistributorName(e.target.value)} />
                    </div>
                    <div className="input-field">
                        <input type="text" placeholder="GST No" value={gstNo} onChange={(e) => setGstNo(e.target.value)} />
                    </div>
                </div>
                <hr />
                {variants.map((variant, variantIndex) => (
                    <div key={variantIndex}>
                        <div>{variant.variantName}</div>
                        {variant.options.map((option, optionIndex) => (
                            <div className="option-viewer" key={optionIndex}>
                                <input
                                    type="text"
                                    value={option.name}
                                    onChange={(e) => handleOptionInputChange(variantIndex, optionIndex, e)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddOption(variantIndex) }}
                                    placeholder="Enter Option Name"
                                    ref={(inputRef) => {
                                        variantInputRefs.current[variantIndex] = variantInputRefs.current[variantIndex] || [];
                                        variantInputRefs.current[variantIndex][optionIndex] = inputRef;
                                    }}
                                />
                                <button onClick={() => handleRemoveOption(variantIndex, optionIndex)} className="btn-action">Remove</button>
                            </div>
                        ))}
                        <button onClick={() => handleAddOption(variantIndex)} className="btn-action">Add Option</button>
                        <button onClick={() => handleRemoveVariant(variantIndex)} className="btn-action">Remove Variant</button>
                    </div>
                ))}
                <div className="-variant-form-row">
                    <input
                        type="text"
                        value={newVariant}
                        onChange={handleVariantInputChange}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddVariant() }}
                        placeholder="Enter Variant Name"
                    />
                    <button onClick={handleAddVariant} className="btn-action">+</button>
                </div>
                <VariantDisplay variants={variants} generatedVariants={generatedVariants} onSave={handleSaveVariants} />
                <div className="form-buttons">
                    <button onClick={handleSubmit} className="btn-add">{buttonText}</button>
                    <button onClick={onClose} className="btn-cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddProductDialog;
