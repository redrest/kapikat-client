import React, {FC, useEffect, useRef, useState} from 'react';
import PhoneInput from "../../../components/ui/PhoneInput/PhoneInput";

interface ProfileInformationProps {
    userEmail: string;
    editableUser: { name: string; phone: string };
    setEditableUser: (u: { name: string; phone: string }) => void;
    saveProfile: () => void;
    onChangePassword: () => void;
    success: string;
    error: string;
}

const ProfileInformation: FC<ProfileInformationProps> = ({userEmail, editableUser, setEditableUser, saveProfile, onChangePassword, success, error}) => {
    const initialRef = useRef({ name: '', phone: '' });
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const initial = initialRef.current;

        if (!initial.name && !initial.phone && (editableUser.name || editableUser.phone)) {
            initialRef.current = { name: editableUser.name, phone: editableUser.phone };
        }

        const changed = editableUser.name !== initialRef.current.name || editableUser.phone !== initialRef.current.phone;
        setIsDirty(changed);
    }, [editableUser.name, editableUser.phone]);


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableUser({ ...editableUser, name: e.target.value });
    }

    return (
        <section className="profile-section">
            <h2 className="profile-section__title">Профиль</h2>
            <div className="profile-section__field">
                <label htmlFor="name">Имя</label>
                <input
                    id="name"
                    type="text"
                    className="profile-section__input"
                    placeholder="Как вас зовут?"
                    value={editableUser.name}
                    onChange={handleNameChange}
                />
            </div>
            <div className="profile-section__field">
                <label htmlFor="phone">Телефон</label>
                <PhoneInput  value={editableUser.phone}
                             onChange={(phone) => setEditableUser({ ...editableUser, phone })}
                             id={"phone"}
                             placeholder={"Телефон"}
                />
            </div>
            <div className="profile-section__field">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    className="profile-section__input profile-section__input--disabled"
                    value={userEmail}
                    disabled
                />
            </div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
            <div className="profile-section__actions">
                <button
                    type="button"
                    className={`profile-section__button ${isDirty ? 'profile-section__button--active' : 'profile-section__button--disabled'}`}
                    onClick={saveProfile}
                    disabled={!isDirty}
                >
                    Сохранить
                </button>
                <button
                    type="button"
                    className="profile-section__button"
                    onClick={onChangePassword}
                >
                    Изменить пароль
                </button>
            </div>
        </section>
    );
};

export default ProfileInformation;
