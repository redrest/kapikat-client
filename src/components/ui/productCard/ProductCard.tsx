import React, {FC, useState} from 'react';
import {IProduct} from '../../../types/types';
import {Link} from "react-router-dom";
import './ProductCard.scss';
import {FaMinus, FaPlus} from "react-icons/fa";
import CartActions from "../cartAction/CartActions";

interface ProductCardProps {
    product: IProduct;
    onAdd: (product: IProduct) => void;
    onReduce: (product: IProduct) => void;
    quantity: number;
}

const ProductCard: FC<ProductCardProps> = ({ product, onAdd, onReduce, quantity }) => {
    return (
        <div className="product-card">
            <Link to={`/products/${product._id}`} className="product-card__container">
                <div className="product-card__image">
                    <img src={product.image} alt={product.name} />
                    {product.discount && (
                        <div className="product-card__discount">
                            -{product.discount}%
                        </div>
                    )}
                </div>
                <div className="product-card__name">
                    {product.name}
                    <span className="product-card__weight">
                        {product.weight.value} {product.weight.unit}
                    </span>
                </div>
                <div className="product-card__price">
                    {product.discount ? (
                        <div className="product-card__price-wrapper">
                            <span className="product-card__price-new">
                                {Math.round(product.price * (1 - product.discount / 100))} ₽
                            </span>
                            <span className="product-card__price-old">
                                {product.price} ₽
                            </span>
                        </div>
                    ) : (
                        <span className="product-card__price-regular">{product.price} ₽</span>
                    )}
                </div>
                <CartActions product={product}
                             quantity={quantity}
                             onAdd={onAdd}
                             onReduce={onReduce}
                             type={"product-card"}
                />
            </Link>
        </div>
    );
};
export default ProductCard;
