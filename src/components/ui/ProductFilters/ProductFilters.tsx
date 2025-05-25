import React, {FC} from 'react';
import './ProductFilters.scss';
import {IoClose} from "react-icons/io5";

interface ProductFiltersProps {
    selectedSort: 'min' | 'max' | null;
    onSortChange: (order: 'min' | 'max') => void;
    onClearFilters: () => void;
    availableTags: string[];
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
}

const ProductFilters: FC<ProductFiltersProps> = ({selectedSort, onSortChange, onClearFilters, availableTags, selectedTags, onTagToggle,}) => {
    return (
        <div className="product-filters">
            {(selectedTags.length > 0 || selectedSort) && (
                <button className="clear-filters" onClick={onClearFilters}>
                    <IoClose className="clear-filters__icon"/>
                </button>
            )}
            <div className="product-filters__content">
                <div className="tag-filter">

                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            className={selectedTags.includes(tag) ? 'active' : ''}
                            onClick={() => onTagToggle(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
