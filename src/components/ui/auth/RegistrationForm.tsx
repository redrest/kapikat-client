import React, {FC, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './AuthStyles.scss';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Loader from "../../Loader";
import {useUser} from "../../../context/AuthContext";
import api from "../../../api/axios";

interface IRegistrationData {
    email: string;
    password: string;
    confirmPassword: string;
}

const RegistrationForm: FC = () => {
    const { login } = useUser();
    const [formData, setFormData] = useState<IRegistrationData>({email: '', password: '', confirmPassword: ''});
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState({
        email: false,
        password: false,
        confirmPassword: false
    });

    const handleBlur = (field: keyof typeof isDirty) => {
        setIsDirty(prev => ({...prev, [field]: true}));
    }

    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, email: e.target.value}));
        const re =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!re.test(String(e.target.value).toLowerCase())) {
            setEmailError("Некорректный формат почты")
        } else {
            setEmailError("");
        }

    };

    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, password: e.target.value}));
        const re = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&?/* "]).*$/;
        if(!re.test(String(e.target.value)) || e.target.value.length === 0) {
            setPasswordError("Пароль должен содержать не менее 8 символов, как минимум одну цифру, одну букву и один уникальный символ: !#$%&?/*")
        } else {
            setPasswordError("");
        }
    };

    const confirmPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, confirmPassword: e.target.value}));
        if (e.target.value !== formData.password) {
            setConfirmPasswordError("Пароли не совпадают");
        } else if (e.target.value.length < 1) {
            setConfirmPasswordError("Пароль не может быть пустым")
        } else {
            setConfirmPasswordError("");
        }

    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/registration', {
                email: formData.email,
                password: formData.password,
            }, { withCredentials: true });

            const data = response.data;

            const { accessToken, user } = data;

            if (accessToken && user) {
                login(user, accessToken);
            }

            navigate('/auth/registration-confirmation', {
                state: { email: formData.email }
            });

            setFormData({ email: '', password: '', confirmPassword: '' });

        } catch (error: any) {
            if (error.response && error.response.data?.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Ошибка при отправке запроса");
            }
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
                    <h2>Регистрация</h2>
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

                    <div className="auth-form__field password-wrapper">
                        <label>Подтверждение пароля:</label>
                        <div className="input-with-icon">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={confirmPasswordHandler}
                                onBlur={() => handleBlur("confirmPassword")}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="toggle-password-icon"
                            >
                                {showConfirmPassword ? <AiOutlineEyeInvisible/> : <AiOutlineEye/>}
                            </button>
                        </div>
                        {isDirty.confirmPassword && confirmPasswordError &&
                            <p style={{color: 'red'}}>{confirmPasswordError}</p>}
                    </div>

                    <button type="submit">Зарегистрироваться</button>

                    {message && <p>{message}</p>}

                    <p style={{marginTop: '1rem'}}>
                        Уже есть аккаунт? <Link to="/auth/login">Войти</Link>
                    </p>
                </div>
            </form>)}
        </>
    );
};

export default RegistrationForm;
