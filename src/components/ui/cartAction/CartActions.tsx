import React, {FC} from 'react';
import { IProduct } from '../../../types/types';
import { FaMinus, FaPlus } from 'react-icons/fa';
import './CartActions.scss';

interface CartActionsProps {
    product: IProduct;
    quantity: number;
    onAdd: (product: IProduct) => void;
    onReduce: (product: IProduct) => void;
    type: "product-page" | "cart" | "product-card";
}

const CartActions: FC<CartActionsProps> = ({ product, quantity, onAdd, onReduce, type }) => {
    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
    }

    return (
        <>
            {type === 'cart' ? (
                <div className={`cart-actions cart-actions--${type}`}>
                    <div className="cart-actions__counter">
                        <button onClick={() => onReduce(product)}>
                            <FaMinus className="counter-icon"/>
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => onAdd(product)}>
                            <FaPlus className="counter-icon"/>
                        </button>
                    </div>
                </div>
            ) : (
                <div className={`cart-actions cart-actions--${type}`} onClick={handleActionClick}>
                    {quantity > 0 ? (
                        <div className="cart-actions__counter">
                            <button onClick={() => onReduce(product)}>
                                <FaMinus className="counter-icon"/>
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => onAdd(product)}>
                                <FaPlus className="counter-icon"/>
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => onAdd(product)}>В корзину</button>
                    )}
                </div>
            )}
        </>
    );
};

export default CartActions;
