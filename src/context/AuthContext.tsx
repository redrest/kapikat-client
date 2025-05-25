import {createContext, useContext, useState, useEffect, ReactNode, FC} from 'react';
import api from '../api/axios';
import {IAddress, Role} from "../types/types";
import {useGuestCartContext} from "./GuestCartContext";

export interface User {
    _id: string;
    name?: string;
    email: string;
    phone?: string;
    addresses: IAddress[];
    role: Role.User | Role.Admin;
}

interface UserProviderProps {
    children: ReactNode;
}

interface UserContextType {
    user: User | null;
    login: (userData: User, accessToken: string) => void;
    logout: () => void;
    fetchProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser должен использоваться с UserProvider');
    }
    return context;
};


export const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const {clearCart: clearGuestCart } = useGuestCartContext();
    const [isLoading, setIsLoading] = useState(true);

    const login = async (userData: User, accessToken: string) => {
        setUser(userData);
        localStorage.setItem('token', accessToken);

        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{}');

        const entries = Object.entries(guestCart);
        if (entries.length > 0) {
            try {
                await Promise.all(entries.map(([productId, quantity]) =>
                    api.post('/cart/add', { productId, quantity })
                ));
            } catch (err) {
                console.error('Ошибка переноса гостевой корзины:', err);
            }

            localStorage.removeItem('guestCart');
            clearGuestCart();
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        } finally {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await api.get<User>('/profile');
            setUser(res.data);
        } catch {
            logout();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile();
        } else {
            setIsLoading(false);
        }
    }, []);


    return (
        <UserContext.Provider value={{ user, login, logout, fetchProfile }}>
            {children}
        </UserContext.Provider>
    );
};
