import React, {FC, useEffect, useState} from 'react';
import Cart from '../cart/Cart';
import {FiX} from "react-icons/fi";
import {FaShoppingCart} from "react-icons/fa";
import './CartPanel.scss';
import {useCartContext} from "../../../context/CartContext";
import {Link} from "react-router-dom";
import Modal from "../modal/Modal";
import {useLocation} from "react-use";

const CartPanel: FC = () => {
    const [visible, setVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const location = useLocation();
    const {
        cartItems,
        cartMap,
        handleAdd,
        handleRemove,
        handleReduce,
        handleClear
    } = useCartContext();

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        setVisible(false);
        closeModal();
    }, [location.pathname]);

    return (
        <div className="cart-panel">
            <button
                className="cart-panel__button"
                onClick={() => setVisible(prev => !prev)}
                title="Корзина"
            >
                <FaShoppingCart className="cart-panel__icon"/>
                {totalQuantity > 0 && <span className="cart-panel__badge">{totalQuantity}</span>}
            </button>
            {visible && (
                <div
                    className={`cart-panel__overlay ${visible ? 'visible' : ''}`}
                    onClick={() => setVisible(false)}
                />
            )}
            <div className={`cart-panel__panel ${visible ? 'open' : ''}`}>
                <div className="cart-panel__content">
                    <button className="cart-panel__close" onClick={() => setVisible(false)}>
                        <FiX className="cart-panel__icon"/>
                    </button>
                    <div className="cart-panel__body">
                        <Cart
                            items={cartItems}
                            onAdd={handleAdd}
                            onRemove={handleRemove}
                            onReduce={(p) => handleReduce(p, cartMap[p._id] || 0)}
                            onClear={handleClear}
                            onOpenModal={openModal}
                        />
                    </div>
                    <Modal visible={isModalOpen} setVisible={closeModal}>
                        <div className="modal-content-wrapper">
                            <h2>Оформление заказа</h2>
                            <p>Для продолжения необходимо авторизоваться.</p>
                            <Link to="/auth/login" className="modal-auth-link" onClick={() =>closeModal()}>
                                Авторизоваться
                            </Link>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default CartPanel;
