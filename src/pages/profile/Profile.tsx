import React, { FC, useState, useEffect } from 'react';
import { useUser } from '../../context/AuthContext';
import api from '../../api/axios';
import {IAddress} from "../../types/types";
import ProfileInformation from "./profile-tabs/ProfileInformation";
import ProfileAddresses from "./profile-tabs/ProfileAddresses";
import ProfileOrdersHistory from "./profile-tabs/ProfileOrdersHistory";
import './Profile.scss';
import ProfilePasswordActions from "./profile-tabs/ProfilePasswordActions";
import {Navigate} from "react-router-dom";
import Loader from "../../components/Loader";
import Breadcrumbs from "../../components/ui/breadCrumbs/BreadCrumbs";

const ProfilePage: FC = () => {
    const { user, fetchProfile } = useUser();
    const [tab, setTab] = useState<'info' | 'orders' | 'addresses'>('info');
    const [profile, setProfile] = useState({ name: '', phone: ''});
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!user) return;
        setProfile({ name: user.name || '', phone: user.phone || '' });
        setAddresses(user.addresses || []);
        setIsLoading(false);
    }, [user]);

    if (!user) return <Navigate to="/login" />;

    const saveProfile = async () => {
        setError('');
        setSuccess('');
        try {
            await api.put('/profile', profile);
            setSuccess('Профиль сохранён');
            fetchProfile();
        } catch {
            setError('Ошибка сохранения');
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-page-wrapper">
                <Breadcrumbs/>
                <aside className="profile-page__sidebar">
                    <button onClick={() => setTab('info')} className={tab === 'info' ? 'active' : ''}>
                        Информация
                    </button>
                    <button onClick={() => setTab('orders')} className={tab === 'orders' ? 'active' : ''}>
                        Заказы
                    </button>
                    <button onClick={() => setTab('addresses')} className={tab === 'addresses' ? 'active' : ''}>
                        Адреса
                    </button>
                </aside>
                <main className="profile-page__content">
                    {isLoading ? (
                        <Loader/>
                    ) : (
                        <>
                            {tab === 'info' &&
                                <ProfileInformation
                                    userEmail={user?.email || ''}
                                    editableUser={profile}
                                    setEditableUser={setProfile}
                                    saveProfile={saveProfile}
                                    onChangePassword={() => setPasswordModalOpen(true)}
                                    success={success}
                                    error={error}
                                />
                            }
                            {tab === 'orders' && <ProfileOrdersHistory/>}
                            {tab === 'addresses' &&
                                <ProfileAddresses
                                    addresses={addresses}
                                    setAddresses={setAddresses}
                                    fetchData={() => fetchProfile()}
                                />
                            }
                        </>
                    )}
                </main>
                <ProfilePasswordActions
                    isOpen={passwordModalOpen}
                    onClose={() => setPasswordModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
