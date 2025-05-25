import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './AuthContext';
import { useGuestCartContext } from './GuestCartContext';
import api from '../api/axios';
import { ICart, ICartItem, IProduct } from '../types/types';

interface CartContextType {
    cartItems: ICartItem[];
    cartMap: Record<string, number>;
    handleAdd: (product: IProduct, quantity?: number) => Promise<void>;
    handleRemove: (product: IProduct) => Promise<void>;
    handleReduce: (product: IProduct, quantity: number) => Promise<void>;
    handleClear: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();
    const {
        cart: guestCart,
        addItem: guestAdd,
        removeItem: guestRemove,
        reduceItem: guestReduce,
        clearCart: guestClear,
    } = useGuestCartContext();

    const [cartItems, setItems] = useState<ICartItem[]>([]);
    const [cartMap, setMap] = useState<Record<string, number>>({});

    const rebuildMap = (arr: ICartItem[]) => {
        const m: Record<string, number> = {};
        arr.forEach(i => {
            m[i.product._id] = i.quantity;
        });
        setMap(m);
    };

    const fetchCart = async () => {
        if (user) {
            try {
                const res = await api.get<ICart>('/cart');
                setItems(res.data.items);
                rebuildMap(res.data.items);
            } catch (e) {
                console.error('Ошибка загрузки корзины', e);
            }
        } else {
            const entries = Object.entries(guestCart);
            if (!entries.length) {
                setItems([]);
                setMap({});
                return;
            }
            const loaded: ICartItem[] = [];
            for (const [id, qty] of entries) {
                try {
                    const r = await api.get<{ data: IProduct }>(`/products/${id}`);
                    const prod = r.data.data;
                    const finalPrice = prod.discount
                        ? Math.round(prod.price * (1 - prod.discount / 100))
                        : prod.price;
                    loaded.push({ product: prod, quantity: qty, finalPrice });
                } catch (e) {
                    console.error(e);
                }
            }
            setItems(loaded);
            rebuildMap(loaded);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user, JSON.stringify(guestCart)]);

    const handleAdd = async (product: IProduct, quantity: number = 1) => {
        if (user) {
            await api.post('/cart/add', { productId: product._id, quantity });
            await fetchCart();
        } else {
            guestAdd(product._id, quantity);
        }
    };


    const handleRemove = async (product: IProduct) => {
        if (user) {
            await api.delete(`/cart/remove/${product._id}`);
            await fetchCart();
        } else {
            guestRemove(product._id);
        }
    };

    const handleReduce = async (product: IProduct, quantity: number) => {
        if (user) {
            if (quantity <= 1) {
                await api.delete(`/cart/remove/${product._id}`);
                     } else {
                await api.put('/cart/update', { productId: product._id, quantity: quantity - 1 });
            }
            await fetchCart();
        } else {
            guestReduce(product._id);
        }
    };

    const handleClear = async () => {
        if (user) {
            await api.delete('/cart/clear');
            await fetchCart();
        } else {
            guestClear();
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, cartMap, handleAdd, handleRemove, handleReduce, handleClear }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCartContext must be used within CartProvider');
    return ctx;
};
