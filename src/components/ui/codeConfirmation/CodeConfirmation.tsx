import React, {FC, useState, useEffect} from 'react';
import './CodeConfirmation.scss';

interface CodeConfirmationProps {
    title: string;
    onSubmit: (code: string) => Promise<void>;
    onResend?: () => Promise<void>;
    resendCooldown?: number;
}

const CodeConfirmation: FC<CodeConfirmationProps> = ({title, onSubmit, onResend, resendCooldown = 60}) => {
    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [resendTimer, setResendTimer] = useState(resendCooldown);

    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => {
                setResendTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [resendTimer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await onSubmit(code);
            setSuccess('Код подтверждён.');
        } catch (err: any) {
            console.error('Ошибка при подтверждении кода:', err);
            const message =
                err?.response?.data?.message ||
                'Ошибка при подтверждении кода.';
            setError(message);
            setSuccess('');
        }
    };

    const handleResend = async () => {
        if (onResend && resendTimer === 0) {
            try {
                await onResend();
                setResendTimer(resendCooldown);
            } catch (err: any) {
                setError(err.message || 'Ошибка при повторной отправке кода.');
            }
        }
    };

    return (
        <div className="code-confirmation">
            <div className="container">
                <h2>{title}</h2>
                <form className="code-confirmation__form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d{1,6}"
                        maxLength={6}
                        value={code}
                        onChange={(e) => {
                            const onlyDigits = e.target.value.replace(/\D/g, '');
                            if (onlyDigits.length <= 6) setCode(onlyDigits);
                        }}
                        placeholder="Введите код"
                        required
                    />

                    <button type="submit">Подтвердить</button>
                </form>
                {error && <p className="message message--error">{error}</p>}
                {success && <p className="message message--success">{success}</p>}
                {onResend && (
                    <div className="code-confirmation__resend">
                        <button onClick={handleResend} disabled={resendTimer > 0}>
                            {resendTimer > 0 ? `Повторить через ${resendTimer} сек` : 'Отправить код повторно'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeConfirmation;
