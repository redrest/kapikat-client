import React, { useState } from 'react';
import './Authorization.scss';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const ForgotPassword = () => {
    const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', {email});
            setStep('verify');
            setMessage('Код подтверждения отправлен на почту');
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Ошибка при отправке кода');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
        try {
            await api.post('/auth/verify-code', {email, code});
            setStep('reset');
            setMessage('Код подтвержден. Введите новый пароль');
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Неверный код');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (newPassword !== confirmPassword) {
            setMessage('Пароли не совпадают');
            return;
        }
        setIsLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email,
                code,
                newPassword
            });
            setMessage('Пароль успешно изменён. Теперь вы можете войти.');
            setStep('email');
            setEmail('');
            setCode('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Ошибка при смене пароля');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                {isLoading ? (
                    <Loader/>
                ) : (
                    <div className="wrapper">
                        <h2>Восстановление пароля</h2>

                        {step === 'email' && (
                            <form onSubmit={handleEmailSubmit} className="auth-form__field">
                                <label>Введите ваш email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit">Отправить код</button>
                                {message && <p>{message}</p>}
                            </form>
                        )}

                        {step === 'verify' && (
                            <form onSubmit={handleCodeSubmit} className="auth-form__field">
                                <label>Введите код из письма:</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                                <button type="submit">Подтвердить код</button>
                            </form>
                        )}

                        {step === 'reset' && (
                            <form onSubmit={handleResetPassword} className="auth-form__field">
                                <label>Новый пароль:</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <label>Подтвердите пароль:</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button type="submit">Сменить пароль</button>
                                {message && <p>{message}</p>}
                            </form>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
