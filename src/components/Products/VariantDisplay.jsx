import React, { useState, useEffect } from 'react';
import './VariantDisplay.css';

function VariantDisplay({ variants, product, onSave }) {
    const [generatedVariants, setGeneratedVariants] = useState([]);
    const [variantStates, setVariantStates] = useState([]);

    useEffect(() => {
        generateCombinations(variants);
    }, [variants]);

    useEffect(() => {
        if (product) {
            updateVariantStatesFromProduct(product);
        }
    }, [product, variants]); // Added variants to the dependency array

    const generateCombinations = (variants) => {
        if (variants.length === 0) return [[]];
        
        const combinations = [];
        
        const generate = (index, current) => {
            if (index === variants.length) {
                combinations.push(current);
                return;
            }
            
            variants[index].options.forEach((option) => {
                generate(index + 1, [...current, { [variants[index].variantName]: option.name }]);
            });
        };
    
        generate(0, []);
        
        const existingVariantStates = [...variantStates];
        const newVariantStates = [];
        for (let i = 0; i < combinations.length; i++) {
            if (i < existingVariantStates.length) {
                newVariantStates.push(existingVariantStates[i]);
            } else {
                newVariantStates.push({
                    quantity: product ? product.quantity : 0,
                    bp: product ? product.buyPrice : 0,
                    sp: product ? product.sellPrice : 0,
                });
            }
        }
    
        setGeneratedVariants(combinations);
        setVariantStates(newVariantStates);
    };
    
    const updateVariantStatesFromProduct = (product) => {
        const updatedStates = variantStates.map(state => ({
            ...state,
            quantity: product.quantity,
            bp: product.buyPrice,
            sp: product.sellPrice,
        }));
        setVariantStates(updatedStates);
    };

    const handleEditOption = (variantIndex, inputType, newValue) => {
        const updatedVariantStates = [...variantStates];
        updatedVariantStates[variantIndex] = {
            ...updatedVariantStates[variantIndex],
            [inputType]: newValue,
        };
        setVariantStates(updatedVariantStates);
    };

    const handleSaveVariants = () => {
        const formattedVariants = generatedVariants.map((combination, index) => {
            const variantObject = {};
            combination.forEach((variant) => {
                const variantName = Object.keys(variant)[0];
                variantObject[variantName] = variant[variantName];
            });
            return {
                ...variantObject,
                quantity: variantStates[index].quantity,
                bp: variantStates[index].bp,
                sp: variantStates[index].sp,
            };
        });

        onSave(formattedVariants);
    };

    return (
        <div className="variant-display">
            <h3>Variants and Options</h3>
            <div className="variant-table">
                <div className="table-header">
                    {variants.map((variant) => (
                        <div className="header-cell" key={variant.variantName}>{variant.variantName}</div>
                    ))}
                    <div className="header-cell">Quantity</div>
                    <div className="header-cell">Buy Price</div>
                    <div className="header-cell">Sell Price</div>
                </div>
                <div className="table-body">
                    {generatedVariants.map((combination, index) => (
                        <div className="variant-row" key={index}>
                            {combination.map((variant, idx) => (
                                <div className="variant-value" key={idx}>
                                    <input
                                        type="text"
                                        value={variant[variants[idx].variantName]}
                                        readOnly
                                    />
                                </div>
                            ))}
                            <div className="input-cell">
                                <input
                                    type="number"
                                    value={variantStates[index].quantity}
                                    onChange={(e) => handleEditOption(index, 'quantity', e.target.value)}
                                />
                            </div>
                            <div className="input-cell">
                                <input
                                    type="number"
                                    value={variantStates[index].bp}
                                    onChange={(e) => handleEditOption(index, 'bp', e.target.value)}
                                />
                            </div>
                            <div className="input-cell">
                                <input
                                    type="number"
                                    value={variantStates[index].sp}
                                    onChange={(e) => handleEditOption(index, 'sp', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* No need for a button, changes are saved instantly */}
        </div>
    );
}

export default VariantDisplay;
