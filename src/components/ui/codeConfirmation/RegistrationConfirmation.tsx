import React, { FC } from 'react';
import CodeConfirmation from './CodeConfirmation';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import './CodeConfirmation.scss';

const RegistrationConfirmation: FC = () => {
    const location = useLocation();
    const { email } = location.state || {};
    const navigate = useNavigate();

    const verifyCode = async (code: string) => {
        const response = await api.post('/auth/confirm-email', {
            email,
            code,
        }, { withCredentials: true });
        return response.data;
    };

    const resendCode = async () => {
        const response = await api.post('/auth/resend-confirmation-code', {
            email,
        }, { withCredentials: true });
        return response.data;
    };

    const handleSubmit = async (code: string) => {
        try {
            const data = await verifyCode(code);
            const { token, user } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Ошибка подтверждения кода:', error);
        }
    };

    return (
        <div className="registration-code">
            <div className="registration-code__wrapper">
                <CodeConfirmation
                    title="Подтвердите вашу почту"
                    onSubmit={handleSubmit}
                    onResend={resendCode}
                    resendCooldown={60}
                />
            </div>
        </div>
    );
};

export default RegistrationConfirmation;
