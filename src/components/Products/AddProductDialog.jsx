import React, { useState, useEffect } from 'react';
import './AddProductDialog.css';
import { addProductToDatabase, editProducts } from '../../Database/Database';
import VariantDisplay from './VariantDisplay';

function AddProductDialog({ onClose, onChange, product }) {
    const [isAddProduct, setIsAddProduct] = useState(null);

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
    const [variants, setVariants] = useState([]);
    const [heading, setHeading] = useState("Add Product");
    const [buttonText, setButtonText] = useState("Add");

    useEffect(() => {
        if (product) {
            setHeading("Edit Product");
            setButtonText("Edit");
            setIsAddProduct(false);
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
        } else {
            setIsAddProduct(true);
        }
    }, [product]);

    const handleAddVariant = (e) => {
        if (e.key === 'Enter') {
            setVariants([...variants, { variantName: e.target.value, options: [] }]);
            e.target.value = '';
        }
    };

    const handleAddOption = (variantIndex, e) => {
        if (e.key === 'Enter') {
            const updatedVariants = [...variants];
            updatedVariants[variantIndex].options.push({ name: e.target.value, quantity: quantity, unit: unit, buyPrice: buyPrice, sellPrice: sellPrice, tax: tax });
            setVariants(updatedVariants);
            e.target.value = '';
        }
    };

    const handleRemoveVariant = (variantIndex) => {
        const updatedVariants = [...variants];
        updatedVariants.splice(variantIndex, 1);
        setVariants(updatedVariants);
    };

    const handleRemoveOption = (variantIndex, optionIndex) => {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].options.splice(optionIndex, 1);
        setVariants(updatedVariants);
    };

    const handleCancel = () => {
        onClose();
        onChange();
    };

    const generateProductCombinations = (variants) => {
        if (!variants.length) return [];

        const combine = (acc, variant) => {
            if (!acc.length) {
                return variant.options.map(option => ({ name: option.name, options: [option] }));
            }

            const combinations = [];
            for (const option of variant.options) {
                for (const item of acc) {
                    combinations.push({
                        name: `${item.name} ${option.name}`,
                        options: [...item.options, option]
                    });
                }
            }
            return combinations;
        };

        return variants.reduce(combine, []);
    };

    const handleSubmit = async () => {
        const baseProduct = {
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
            variants
        };
    
        const combinations = generateProductCombinations(variants);
    
        const productsToAdd = [
            { ...baseProduct, productName: productName }, // Base product without combination
            ...combinations.map(combination => ({
                ...baseProduct,
                productName: `${productName} ${combination.name}`,
                variants: combination.options
            }))
        ];
    
        // Iterate over products to add
        for (let i = 0; i < productsToAdd.length; i++) {
            const product = productsToAdd[i];
    
            // Console log product name
            console.log("Product Name:", product.productName);
    
            // Increment ID for each product (assuming id is a number)
            product.id = id + i;
    
            try {
                // Update product in database
                if (buttonText === "Edit") {
                    await editProducts(product);
                } else {
                    await addProductToDatabase(product);
                }
                console.log("Product added to database");
    
                // Delay for 1 second (1000 milliseconds)
                await new Promise(resolve => setTimeout(resolve, 1000));
    
            } catch (error) {
                console.error("Error adding product to database:", error);
                // Handle error as needed
            }
        }
    
        // After all products added, update state or perform other actions
        onChange();
        onClose();
    };
        
    

    useEffect(() => {
        const updatedVariants = variants.map(variant => ({
            ...variant,
            options: variant.options.map(option => ({
                ...option,
                quantity: quantity || option.quantity,
                buyPrice: buyPrice || option.buyPrice,
                sellPrice: sellPrice || option.sellPrice,
            }))
        }));
        setVariants(updatedVariants);
    }, [quantity, buyPrice, sellPrice]);

    return (
        <div className="addproduct-dialog-overlay">
            <div className="addproduct-dialog">
                <h2>{heading}</h2>
                <div className="addproduct-form">
                    <div className="addproduct-form-row">
                        <div className="addproduct-input-field">
                            <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
                        </div>
                        <div className="addproduct-input-field">
                            <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                        </div>
                        <div className="addproduct-input-field">
                            <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
                        </div>
                    </div>
                    <div className="addproduct-form-row">
                        <div className="addproduct-input-field">
                            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                        <div className="addproduct-input-field">
                            <input type="text" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>
                        <div className="addproduct-input-field">
                            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                                <option value="Nos">Nos</option>
                                <option value="Kg">Kg</option>
                                <option value="gm">gm</option>
                                <option value="Meter">Meter</option>
                                <option value="cm">cm</option>
                            </select>
                        </div>
                    </div>
                    <div className="addproduct-form-row">
                        <div className="addproduct-input-field">
                            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    <div className="addproduct-form-row">
                        <div className="addproduct-input-field">
                            <input type="text" placeholder="Buy Price" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
                        </div>
                        <div className="addproduct-input-field">
                            <input type="text" placeholder="Sell Price" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
                        </div>
                        <div className="addproduct-input-field">
                            <input type="number" min="0" max="100" step="0.01" placeholder="Tax (%)" value={tax} onChange={(e) => setTax(e.target.value)} />
                        </div>
                    </div>
                    <div className="addproduct-form-row">
                        <div className="addproduct-input-field">
                            <input type="text" placeholder="Distributor Name" value={distributorName} onChange={(e) => setDistributorName(e.target.value)} />
                        </div>
                        <div className="addproduct-input-field">
                            <input type="text" placeholder="GST No" value={gstNo} onChange={(e) => setGstNo(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="addproduct-variant-form">
                    <label>Variants and Options</label>
                    <div className="addproduct-variant-input">
                        <input type="text" placeholder="Enter Variant Name" onKeyPress={handleAddVariant} />
                    </div>
                    {variants.map((variant, variantIndex) => (
                        <div key={variantIndex} className="addproduct-variant">
                            <div className="addproduct-variant-name">
                                <h4>{variant.variantName}</h4>
                                <button className="remove-variant-btn" onClick={() => handleRemoveVariant(variantIndex)}>Remove Variant</button>
                            </div>
                            <div className="addproduct-options">
                                {variant.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="addproduct-option">
                                        <span>{option.name}</span>
                                        <button className="remove-option-btn" onClick={() => handleRemoveOption(variantIndex, optionIndex)}>x</button>
                                    </div>
                                ))}
                                <input type="text" placeholder={`Add option for ${variant.variantName}`} onKeyPress={(e) => handleAddOption(variantIndex, e)} />
                            </div>
                        </div>
                    ))}
                </div>
                <VariantDisplay variants={variants} product={product} onSave={(variants) => setVariants(variants)} />
                <div className="addproduct-form-buttons">
                    <button className="addproduct-btn-add" onClick={handleSubmit}>{buttonText}</button>
                    <button className="addproduct-btn-cancel" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddProductDialog;
