import React, {FC, createContext, useContext } from 'react';
import { useGuestCart } from '../hooks/useGuestCart';

const GuestCartContext = createContext<ReturnType<typeof useGuestCart> | null>(null);

export const GuestCartProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const guestCart = useGuestCart();
    return <GuestCartContext.Provider value={guestCart}>{children}</GuestCartContext.Provider>;
};

export const useGuestCartContext = () => {
    const context = useContext(GuestCartContext);
    if (!context) {
        throw new Error('useGuestCartContext must be used within GuestCartProvider');
    }
    return context;
};
