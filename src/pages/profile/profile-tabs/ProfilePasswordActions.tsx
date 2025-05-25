import React, {FC, useEffect, useState} from 'react';
import Modal from '../../../components/ui/modal/Modal';
import { useUser } from '../../../context/AuthContext';
import api from '../../../api/axios';
import CodeConfirmation from '../../../components/ui/codeConfirmation/CodeConfirmation';
import Loader from "../../../components/Loader";

interface ProfilePasswordActionsProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfilePasswordActions: FC<ProfilePasswordActionsProps> = ({ isOpen, onClose }) => {
    const { user } = useUser();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState({
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
        resetMode: false,
        code: '',
        codeOk: false,
        isDirty: false
    });

    const sendCode = async () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            await api.post('/profile/forgot-password', { email: user?.email });
            setState(m => ({ ...m, resetMode: true }));
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Ошибка отправки кода');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyCode = async (code: string) => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            await api.post('/profile/verify-code', { email: user?.email, code });
            setState(m => ({ ...m, codeOk: true }));
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Неверный код');
        } finally {
            setIsLoading(false);
        }
    };

    const applyPassword = async () => {
        setError('');
        setSuccess('');
        try {
            if (state.newPwd !== state.confirmPwd) {
                setError('Пароли не совпадают');
                return;
            }

            if (state.resetMode) {
                await api.post('/profile/set-new-password', { email: user?.email, newPassword: state.newPwd });
            } else {
                await api.post('/profile/verify-old-password', { oldPassword: state.oldPwd });
                await api.post('/profile/change-password', { newPassword: state.newPwd });
            }
            setSuccess('Пароль изменён');
            setTimeout(() => handleClose(), 3000);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Ошибка при смене пароля');
        }
    };

    const handleClose = () => {
        setState({
            oldPwd: '',
            newPwd: '',
            confirmPwd: '',
            resetMode: false,
            code: '',
            codeOk: false,
            isDirty: false
        });
        setError('');
        setSuccess('');
        onClose();
    };

    useEffect(() => {
        const { oldPwd, newPwd, confirmPwd, resetMode } = state;
        const isAnyFieldFilled = resetMode
            ? newPwd.trim() !== '' || confirmPwd.trim() !== ''
            : oldPwd.trim() !== '' || newPwd.trim() !== '' || confirmPwd.trim() !== '';

        setState(prev => ({
            ...prev,
            isDirty: isAnyFieldFilled,
        }));
    }, [state.oldPwd, state.newPwd, state.confirmPwd, state.resetMode]);

    return (
        <Modal visible={isOpen} setVisible={open => open ? undefined : onClose()}>
            <div className="modal-content-wrapper">
                {isLoading ? (
                    <Loader/>
                ): (
                    <>
                        {!state.resetMode ? (
                            <div className="password-actions">
                                <div className="password-actions__field">
                                    <label>Старый пароль</label>
                                    <input
                                        type="password"
                                        required
                                        value={state.oldPwd}
                                        onChange={e => setState(m => ({...m, oldPwd: e.target.value}))}
                                    />
                                </div>
                                <div className="password-actions__field">
                                    <label>Новый пароль</label>
                                    <input
                                        type="password"
                                        required
                                        value={state.newPwd}
                                        onChange={e => setState(m => ({...m, newPwd: e.target.value}))}
                                    />
                                </div>
                                <div className="password-actions__field">
                                    <label>Подтвердите пароль</label>
                                    <input
                                        type="password"
                                        required
                                        value={state.confirmPwd}
                                        onChange={e => setState(m => ({...m, confirmPwd: e.target.value}))}
                                    />
                                </div>
                                <button className="password-actions__link" onClick={sendCode}>Забыли пароль?</button>
                                {error && <p className="message message--error">{error}</p>}
                                {success && <p className="message message--success">{success}</p>}
                                <div className="password-actions__buttons">
                                    <button onClick={applyPassword}
                                            className={`password-actions__button ${state.isDirty ? 'password-actions__button--active' : 'password-actions__button--disabled'}`}
                                            disabled={!state.isDirty}>
                                        Сохранить
                                    </button>
                                    <button onClick={handleClose} className="password-actions__button">Отмена</button>
                                </div>
                            </div>
                        ) : !state.codeOk ? (
                            <>
                                <CodeConfirmation
                                    title="Код подтверждения отправлен на почту"
                                    onSubmit={verifyCode}
                                    onResend={sendCode}
                                />
                                <div className="password-actions__buttons">
                                    <button className="password-actions__button" onClick={handleClose}>Назад</button>
                                </div>
                            </>
                        ) : (
                            <div className="password-actions">
                                <div className="password-actions__field">
                                    <label>Новый пароль</label>
                                    <input
                                        type="password"
                                        value={state.newPwd}
                                        onChange={e => setState(m => ({...m, newPwd: e.target.value}))}
                                    />
                                </div>
                                <div className="password-actions__field">
                                    <label>Подтвердите пароль</label>
                                    <input
                                        type="password"
                                        value={state.confirmPwd}
                                        onChange={e => setState(m => ({...m, confirmPwd: e.target.value}))}
                                    />
                                </div>
                                {error && <p className="message message--error">{error}</p>}
                                {success && <p className="message message--success">{success}</p>}
                                <div className="password-actions__buttons">
                                    <button onClick={applyPassword}
                                            className={`password-actions__button ${state.isDirty ? 'password-actions__button--active' : 'password-actions__button--disabled'}`}
                                            disabled={!state.isDirty}>
                                        Сохранить
                                    </button>
                                    <button onClick={handleClose} className="password-actions__button">Отмена</button>
                                </div>
                            </div>
                        )}
                    </>)}
                </div>
        </Modal>
    );
};

export default ProfilePasswordActions;
