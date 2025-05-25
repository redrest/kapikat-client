import React from 'react';
import './Authorization.scss';
import LoginForm from "../../components/ui/auth/LoginForm";

const LoginPage = () => {
    return (
        <div className="auth-container">
            <LoginForm/>
        </div>
    );
};

export default LoginPage;
