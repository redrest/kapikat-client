import React, { FC } from 'react';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
}

const formatPhone = (digits: string) => {
    const cleaned = digits.replace(/\D/g, '');
    const length = cleaned.length;

    if (length === 0) return '';

    const actualDigits = cleaned;

    if (length <= 1) return '+7';
    if (length <= 2) return `+7 (${actualDigits[1]}`;
    if (length <= 4) return `+7 (${actualDigits.slice(1, 4)}`;
    if (length <= 7) return `+7 (${actualDigits.slice(1, 4)}) ${actualDigits.slice(4, 7)}`;
    if (length <= 9) return `+7 (${actualDigits.slice(1, 4)}) ${actualDigits.slice(4, 7)}-${actualDigits.slice(7, 9)}`;
    return `+7 (${actualDigits.slice(1, 4)}) ${actualDigits.slice(4, 7)}-${actualDigits.slice(7, 9)}-${actualDigits.slice(9, 11)}`;
};

const PhoneInput: FC<PhoneInputProps> = ({ value, onChange, placeholder = 'Телефон', id = 'phone' }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
        onChange(digits);
    };

    return (
        <input
            id={id}
            type="tel"
            inputMode="numeric"
            maxLength={18}
            placeholder={placeholder}
            value={formatPhone(value)}
            onChange={handleChange}
            className="phone-input"
        />
    );
};

export default PhoneInput;
