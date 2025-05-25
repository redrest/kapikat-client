import React, {useEffect} from 'react';
import './styles/app.scss';
import {BrowserRouter} from 'react-router-dom';
import {useLocation} from "react-use";
import AppRouter from "./components/AppRouter";
import Header from "./components/ui/header/Header";
import {UserProvider} from "./context/AuthContext";
import {GuestCartProvider} from "./context/GuestCartContext";
import {CartProvider} from "./context/CartContext";

const App = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <GuestCartProvider>
            <UserProvider>
                <CartProvider>
                    <BrowserRouter>
                        <Header/>
                        <AppRouter/>
                    </BrowserRouter>
                </CartProvider>
            </UserProvider>
        </GuestCartProvider>
    );
}

export default App;
