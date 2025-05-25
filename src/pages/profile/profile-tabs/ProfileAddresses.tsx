import React, { FC, useEffect, useRef, useState } from 'react';
import api from '../../../api/axios';
import { IAddress } from '../../../types/types';
import Modal from '../../../components/ui/modal/Modal';

interface Props {
    addresses: IAddress[];
    setAddresses: (a: IAddress[]) => void;
    fetchData: () => void;
}

const ProfileAddresses: FC<Props> = ({ addresses, setAddresses, fetchData }) => {
    const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<Omit<IAddress, '_id'>>({
        city: '',
        street: '',
        house: '',
        apartment: '',
    });

    const initialFormRef = useRef<Omit<IAddress, '_id'>>({
        city: '',
        street: '',
        house: '',
        apartment: '',
    });
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const initial = initialFormRef.current;
        const changed =
            form.city !== initial.city ||
            form.street !== initial.street ||
            form.house !== initial.house ||
            (form.apartment || '') !== (initial.apartment || '');

        setIsDirty(changed);
    }, [form]);

    const openModal = (address?: IAddress) => {
        const initial = address
            ? {
                city: address.city,
                street: address.street,
                house: address.house,
                apartment: address.apartment || '',
            }
            : { city: '', street: '', house: '', apartment: '' };

        setForm(initial);
        initialFormRef.current = initial;
        setEditingAddress(address || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
        setForm({ city: '', street: '', house: '', apartment: '' });
        setIsDirty(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAddress?._id) {
                const res = await api.put(`/profile/address/${editingAddress._id}`, form);
                setAddresses(addresses.map(a => a._id === editingAddress._id ? res.data : a));
                fetchData();
            } else {
                const res = await api.post('/profile/address', form);
                setAddresses([...addresses, res.data]);
                fetchData();
            }
            closeModal();

        } catch (err) {
            alert('Ошибка при сохранении адреса');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/profile/address/${id}`);
            setAddresses(addresses.filter(a => a._id !== id));
            fetchData();
        } catch {
            alert('Ошибка при удалении адреса');
        }
    };

    return (
        <section className="profile-section">
            <h2 className="profile-section__title">Адреса доставки</h2>
            <div className="profile-section__actions">
                <button className="profile-section__button" onClick={() => openModal()}>
                    Добавить адрес
                </button>
            </div>
            {addresses.length === 0 && (
                <p style={{marginTop: "15px"}}>У вас пока нет сохраненных адресов.</p>
            )}
            <ul className="address-list">
                {addresses.map(addr => (
                    <li key={addr._id} className="address-item">
                        <div>
                            <p>{addr.city}, {addr.street}, {addr.house}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
                        </div>
                        <div className="profile-section__actions">
                            <button className="profile-section__button profile-section__button--active" onClick={() => openModal(addr)}>Редактировать</button>
                            <button className="profile-section__button" onClick={() => handleDelete(addr._id)}>Удалить</button>
                        </div>
                    </li>
                ))}
            </ul>

            <Modal visible={isModalOpen} setVisible={open => open ? undefined : closeModal()}>
                <div className="modal-content-wrapper">
                    <form onSubmit={handleSubmit} className="modal__form">
                        <div className="address-actions__field">
                            <label>Город</label>
                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="address-actions__field">
                            <label>Улица</label>
                            <input
                                name="street"
                                value={form.street}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="address-actions__field">
                            <label>Дом</label>
                            <input
                                name="house"
                                value={form.house}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="address-actions__field">
                            <label>Квартира</label>
                            <input
                                name="apartment"
                                value={form.apartment || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profile-section__actions">
                            <button
                                className={`profile-section__button ${isDirty ? 'profile-section__button--active' : 'profile-section__button--disabled'}`}
                                type="submit"
                                disabled={!isDirty}
                            >
                                Сохранить
                            </button>
                            <button
                                className="profile-section__button"
                                type="button"
                                onClick={closeModal}
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
};

export default ProfileAddresses;
