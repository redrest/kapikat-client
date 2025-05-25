import { useState, useEffect } from 'react';

type GuestCart = Record<string, number>;

export function useGuestCart() {
    const [cart, setCart] = useState<GuestCart>(() => {
        try {
            return JSON.parse(localStorage.getItem('guestCart') || '{}');
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem('guestCart', JSON.stringify(cart));
    }, [cart]);

    const addItem = (productId: string, qty = 1) => {
        setCart(prev => {
            const old = prev[productId] || 0;
            return { ...prev, [productId]: old + qty };
        });
    };

    const reduceItem = (productId: string) => {
        setCart(prev => {
            const old = prev[productId] || 0;
            if (old <= 1) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: old - 1 };
        });
    };

    const removeItem = (productId: string) => {
        setCart(prev => {
            const { [productId]: _, ...rest } = prev;
            return rest;
        });
    };

    const clearCart = () => {
        setCart({});
    };

    return { cart, addItem, removeItem, reduceItem, clearCart };
}
