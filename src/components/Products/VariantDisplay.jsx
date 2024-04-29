import React, { useState, useEffect } from 'react';
import './VariantDisplay.css';

function VariantDisplay({ variants, onSave }) {
    const [generatedVariants, setGeneratedVariants] = useState([]);
    const [variantStates, setVariantStates] = useState([]);

    useEffect(() => {
        generateCombinations(variants);
    }, [variants]);

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
                    quantity: 0,
                    bp: 0,
                    sp: 0,
                });
            }
        }
    
        setGeneratedVariants(combinations);
        setVariantStates(newVariantStates);
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
                buyPrice: variantStates[index].bp,
                sellPrice: variantStates[index].sp,
            };
        });

        onSave(formattedVariants);
    };

    const handleEditOption = (variantIndex, inputType, newValue) => {
        const updatedVariantStates = [...variantStates];
        if (inputType === 'quantity') {
            updatedVariantStates[variantIndex] = {
                ...updatedVariantStates[variantIndex],
                quantity: newValue,
            };
        } else if (inputType === 'bp') {
            updatedVariantStates[variantIndex] = {
                ...updatedVariantStates[variantIndex],
                bp: newValue,
            };
        } else if (inputType === 'sp') {
            updatedVariantStates[variantIndex] = {
                ...updatedVariantStates[variantIndex],
                sp: newValue,
            };
        }
        setVariantStates(updatedVariantStates);
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
                                        onChange={(e) => handleEditOption(index, idx, e.target.value)}
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
            <button onClick={handleSaveVariants}>Save Variants</button>
        </div>
    );
}

export default VariantDisplay;
