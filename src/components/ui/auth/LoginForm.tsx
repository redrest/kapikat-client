import React, { FC, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthStyles.scss';
import Loader from "../../Loader";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {useUser} from "../../../context/AuthContext";
import api from "../../../api/axios";

interface ILoginData {
    email: string;
    password: string;
}

const LoginForm: FC = () => {
    const { login } = useUser();
    const [formData, setFormData] = useState<ILoginData>({ email: '', password: '' });
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const [isDirty, setIsDirty] = useState({
        email: false,
        password: false,
    });

    const handleBlur = (field: keyof typeof isDirty) => {
        setIsDirty(prev => ({...prev, [field]: true}));
    }

    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, email: value }));
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        setEmailError(!re.test(value.toLowerCase()) ? "Некорректный формат почты" : "");
    };

    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, password: value }));

        if (value.length === 0) {
            setPasswordError("Пароль не может быть пустым");
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password,
            });
            const { accessToken, user } = response.data;
            login(user, accessToken);
            navigate('/');
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Ошибка входа');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="wrapper">
                        <h2>Вход</h2>

                        <div className="auth-form__field">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={emailHandler}
                                onBlur={() => handleBlur("email")}
                                required
                            />
                            {isDirty.email && emailError && <p style={{color: 'red'}}>{emailError}</p>}
                        </div>

                        <div className="auth-form__field password-wrapper">
                            <label>Пароль:</label>
                            <div className="input-with-icon">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={passwordHandler}
                                    onBlur={() => handleBlur("password")}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="toggle-password-icon"
                                >
                                    {showPassword ? <AiOutlineEyeInvisible/> : <AiOutlineEye/>}
                                </button>
                            </div>
                            {isDirty.password && passwordError && <p style={{color: 'red'}}>{passwordError}</p>}
                        </div>

                        <button type="submit">Войти</button>

                        {message && <p style={{marginTop: '1rem', color: 'red'}}>{message}</p>}
                        <p style={{marginTop: '1rem'}}>
                            <Link to="/auth/forgot-password">Забыли пароль?</Link>
                        </p>
                        <p style={{marginTop: '0.2rem'}}>
                            Нет аккаунта? <Link to="/auth/registration">Зарегистрироваться</Link>
                        </p>
                    </div>
                </form>
            )}
        </>

    );
};

export default LoginForm;
