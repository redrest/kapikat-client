import React from 'react';
import RegistrationConfirmation from "../components/ui/codeConfirmation/RegistrationConfirmation";
import Home from '../pages/home/Home';
import RegistrationPage from "../pages/authorization/RegistrationPage";
import LoginPage from "../pages/authorization/LoginPage";
import AdminPage from "../pages/admin/AdminPage";
import Profile from "../pages/profile/Profile";
import ProductPage from "../pages/product/ProductPage";
import Order from "../pages/order/Order";
import ForgotPassword from "../pages/authorization/ForgotPassword";

export const PublicRoutes = [
    {path: '/', component: <Home/>, exact: true},
    {path: '/category/:categoryId', component: <Home/>, exact: true},
    {path: '/search', component: <Home/>, exact: true},

    {path: '/products/:productId', component: <ProductPage/>, exact: true},

    {path: '/profile', component: <Profile/>, exact: true},

    {path: '/order', component: <Order/>, exact: true},

    {path: '/auth/registration', component: <RegistrationPage/>, exact: true},
    {path: '/auth/registration-confirmation', component: <RegistrationConfirmation/>, exact: true},
    {path: '/auth/forgot-password', component: <ForgotPassword/>, exact: true},

    {path: '/auth/login', component: <LoginPage/>, exact: true},
    {path: '/admin', component: <AdminPage/>, exact: true},

]

export default PublicRoutes;
