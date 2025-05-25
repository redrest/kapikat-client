import React, {FC, useEffect, useState} from 'react';
import {ICategory} from '../../../types/types';
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import {Link} from "react-router-dom";
import './CategoryCard.scss';

interface CategoryCardProps {
    category: ICategory;
    subcategories: ICategory[];
    onSelect: (id: string) => void;
    type: 'small' | 'big';
    activeId?: string | null;
}
const CategoryCard: FC<CategoryCardProps> = ({category, subcategories, onSelect, type, activeId}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (type === 'small' && activeId) {
            const activeCategory = subcategories.some(sub => sub._id === activeId);
            setIsOpen(activeCategory);
        }
    }, [activeId, subcategories, type]);

    const toggleSubcategories = () => {
        setIsOpen(open => !open);
    };

    const isLinkActive = (subId: string) => subId === activeId;

    return (
        <>
            {type === 'small' && (
                <div className="category category--small">
                    <div className="category__card"
                         onClick={() => {
                             toggleSubcategories();
                         }}>
                        <div className="category__card__info">
                            <div className="category__card__image">
                                <img src={category.image} alt={category.image}/>
                            </div>
                            <span>{category.name}</span>
                        </div>
                        {subcategories.length > 0 && (
                            isOpen
                                ? <FaChevronUp className="faChevron"/>
                                : <FaChevronDown className="faChevron"/>
                        )}
                    </div>
                    {isOpen && subcategories.length > 0 && (
                        <ul className="category__card__subcategories">
                            {subcategories.map((subcategory) => (
                                <li
                                    key={subcategory._id}
                                    className={
                                        `category__card__link` +
                                        (isLinkActive(subcategory._id)
                                            ? ' category__card__link--active'
                                            : '')
                                    }
                                    onClick={e => {
                                        e.stopPropagation();
                                        onSelect(subcategory._id);
                                    }}
                                >
                                    <Link to={`/category/${subcategory._id}`}>
                                        <span>
                                          {subcategory.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {type === 'big' && (
                <div className="category category--big">
                    <div className="category__card">
                        <h2 className="category__card__title">{category.name}</h2>
                        {subcategories.length > 0 && (
                            <ul className="category__card__subcategories">
                                {subcategories.map((subcategory) => (
                                    <li key={subcategory._id}>
                                        <Link to={`/category/${subcategory._id}`}>
                                            <img src={subcategory.image} alt={subcategory.image}/>
                                            <span onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect(subcategory._id);
                                            }}>
                                                {subcategory.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

        </>
    );
};

export default CategoryCard;
