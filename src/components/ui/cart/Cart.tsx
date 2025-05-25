import React, {FC, useState} from 'react';
import { ICartItem } from '../../../types/types';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import './Cart.scss';
import {useUser} from "../../../context/AuthContext";
import CartActions from "../cartAction/CartActions";
import {Link, useNavigate} from "react-router-dom";
import Modal from "../modal/Modal";

interface CartProps {
    items: ICartItem[];
    onAdd: (product: ICartItem["product"]) => void;
    onRemove: (product: ICartItem["product"]) => void;
    onReduce: (product: ICartItem["product"]) => void;
    onClear: () => void;
    onOpenModal?: () => void;
}

const Cart: FC<CartProps> = ({ items, onAdd, onRemove, onClear, onReduce, onOpenModal }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [authMessage, setAuthMessage] = useState<string | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const total = items.reduce((sum, it) => sum + it.finalPrice * it.quantity, 0);

    const handleOrderClick = () => {
        if (user) {
            navigate('/order');
        } else {
            onOpenModal && onOpenModal();
        }

    };

    return (
        <div className="cart">
            <h2 className="cart-title">Корзина</h2>
            {items.length === 0 ? (
                <p>В вашей корзине пусто!</p>
            ) : (
                <>
                    <ul className="cart__items">
                        {items.map(item => (
                            <li key={item.product._id} className="cart__item">
                                <div className="cart__item__image">
                                    <img src={item.product.image} alt={item.product.image}/>
                                </div>
                                <div className="cart__item__details">
                                    <span className="cart__item__name">
                                        {item.product.name}
                                        <span className="cart__item__weight">{item.product.weight.value} {item.product.weight.unit}</span>
                                    </span>
                                    <div className="cart__item__panel">
                                        <CartActions product={item.product}
                                                     quantity={item.quantity}
                                                     onAdd={onAdd}
                                                     onReduce={onReduce}
                                                     type={'cart'}/>
                                        <div className="cart__item__price">
                                            <span className="cart__item__price--final">{item.finalPrice * item.quantity} ₽ </span>
                                            {item.product.discount && (
                                                <span className="cart__item__price--old">{item.product.price * item.quantity} ₽</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button className="cart__item__delete" onClick={() => onRemove(item.product)}>
                                    <FaTrash/>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="cart__footer">
                        {authMessage && (
                            <div className="cart__auth-message">
                                {authMessage}
                            </div>
                        )}
                        <strong>Итого: {total} ₽</strong>
                        <button className="cart__checkout-button" onClick={handleOrderClick}>
                            К оформлению
                        </button>
                    </div>
                </>
            )}

        </div>
    );
};

export default Cart;
