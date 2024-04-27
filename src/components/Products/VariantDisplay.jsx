import React, { useState, useEffect } from 'react';
import './VariantDisplay.css';

function VariantDisplay({ variants, quantity: initialQuantity = 0, bp: initialBp = 0, sp: initialSp = 0, onSave }) {
    // State to store the generated variants and current quantity, buy price, and sell price
    const [generatedVariants, setGeneratedVariants] = useState([]);
    const [variantStates, setVariantStates] = useState([]);

    useEffect(() => {
        generateCombinations(variants);
    }, [variants, variants.map(v => v.options.length), variants.map(v => v.options)]);
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
        
        // Preserve existing variant states while adding the new variant and its options
        const existingVariantStates = [...variantStates];
        const newVariantStates = [];
        for (let i = 0; i < combinations.length; i++) {
            // Preserve existing variant state if it exists
            if (i < existingVariantStates.length) {
                newVariantStates.push(existingVariantStates[i]);
            } else {
                // Otherwise, initialize state for the new variant
                newVariantStates.push({
                    quantity: initialQuantity,
                    bp: initialBp,
                    sp: initialSp,
                });
            }
        }
    
        setGeneratedVariants(combinations);
        setVariantStates(newVariantStates);
    };
    

    // Function to handle saving generated variants
    const handleSaveVariants = () => {
        // Transform generatedVariants into the desired format
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

    // Function to handle editing variant option
    const handleEditOption = (variantIndex, optionIndex, newValue) => {
        const updatedVariantStates = [...variantStates];
        if (optionIndex === 'quantity') {
            // Update quantity separately
            updatedVariantStates[variantIndex] = {
                ...updatedVariantStates[variantIndex],
                quantity: newValue,
            };
        } else if (optionIndex === 'bp') {
            // Update buy price separately
            updatedVariantStates[variantIndex] = {
                ...updatedVariantStates[variantIndex],
                bp: newValue,
            };
        } else if (optionIndex === 'sp') {
            // Update sell price separately
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
