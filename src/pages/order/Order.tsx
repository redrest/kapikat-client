import React, { FC,useEffect, useState } from 'react';
import { useUser } from '../../context/AuthContext';
import { IAddress, OrderStatus } from '../../types/types';
import api from '../../api/axios';
import PhoneInput from '../../components/ui/PhoneInput/PhoneInput';
import './Order.scss';
import {useNavigate} from "react-router-dom";
import Modal from "../../components/ui/modal/Modal";
import Breadcrumbs from "../../components/ui/breadCrumbs/BreadCrumbs";
import Loader from "../../components/Loader";
import {useCartContext} from "../../context/CartContext";

const Order: FC = () => {
    const { user, fetchProfile } = useUser();
    const {cartItems} = useCartContext();
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: { city: '', street: '', house: '', apartment: '' } as Omit<IAddress, "_id">,
    });
    const savedAddresses = user?.addresses || [];
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [countdown, setCountdown] = useState(20);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!user) return;
        setForm(f => ({
            ...f,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
        }));
    }, [user?.name, user?.email, user?.phone]);

    useEffect(() => {
        if (!modalOpen) return;
        if (countdown <= 0) {
            navigate('/');
            return;
        }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [modalOpen, countdown, navigate]);

    const closeModal = () => {
        setModalOpen(false);
        navigate('/');
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in form.address) {
            setForm(f => ({
                ...f,
                address: { ...f.address, [name]: value }
            }));
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handlePhoneChange = (val: string) => {
        setForm(f => ({ ...f, phone: val }));
    };

    const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const addr = savedAddresses.find(a => a._id === e.target.value);
        if (addr) {
            setForm(f => ({
                ...f,
                address: {
                    city: addr.city,
                    street: addr.street,
                    house: addr.house,
                    apartment: addr.apartment || '',
                }
            }));
        }
    };

    const handleOrder = async () => {
        setIsCreating(true);
        try {
            const payload = {
                user: user && { _id: user._id, name: form.name, email: form.email, phone: form.phone },
                items: cartItems.map(i => ({ product: i.product._id, quantity: i.quantity })),
                total: cartItems.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0),
                address: form.address,
                status: OrderStatus.Pending,
            };
            await api.post('/order', payload);
            setCountdown(20);
            setModalOpen(true);
            fetchProfile();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Ошибка при оформлении заказа');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="order-page">
            <div className="order-page-wrapper">
                <Breadcrumbs/>
                <h2 className="order-page__title">Оформление заказа</h2>
                <div className="order-page__form">
                    <h3>Контактная информация</h3>
                    <div className="order-page__field">
                        <label>Имя</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                        />
                    </div>
                    <div className="order-page__field">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleFormChange}
                        />
                    </div>
                    <div className="order-page__field">
                        <label>Телефон</label>
                        <PhoneInput
                            value={form.phone}
                            onChange={handlePhoneChange}
                            placeholder="Телефон"
                        />
                    </div>
                    <div className="order-page__address">
                        <h3>Адрес доставки</h3>
                        {savedAddresses.length > 0 && (
                            <div className="order-page__field">
                                <label>Сохраненные адреса</label>
                                <select onChange={handleAddressSelect} defaultValue="">
                                    <option value="" disabled>— Ваши адреса —</option>
                                    {savedAddresses.map(a => (
                                        <option key={a._id} value={a._id}>
                                            {a.city}, {a.street} д.{a.house}
                                            {a.apartment ? `, кв.${a.apartment}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="order-page__field">
                            <label>Город</label>
                            <input
                                name="city"
                                value={form.address.city}
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="order-page__field">
                            <label>Улица</label>
                            <input
                                name="street"
                                value={form.address.street}
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="order-page__field">
                            <label>Дом</label>
                            <input
                                name="house"
                                value={form.address.house}
                                onChange={handleFormChange}
                            />
                        </div>
                        <div className="order-page__field">
                            <label>Квартира</label>
                            <input
                                name="apartment"
                                value={form.address.apartment}
                                onChange={handleFormChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="order-page__cart">
                    <h3>Корзина</h3>
                    {cartItems.length === 0
                        ? <p>Корзина пуста</p>
                        : cartItems.map(item => (
                            <div key={item.product._id} className="order-page__cart-item">
                                <div className="order-page__cart-item__image" >
                                    <img src={item.product.image} alt={item.product.image}/>
                                </div>
                                <span className="order-page__cart-item__name">
                                    {item.product.name}
                                    <span className="order-page__cart-item__weight">
                                        {item.product.weight.value} {item.product.weight.unit}
                                    </span>
                                </span>
                                <div className="order-page__cart-item__price">
                                    <span>{item.quantity} × {item.finalPrice} ₽</span>
                                    <span className="order-page__cart-item__price--final">
                                        {item.finalPrice * item.quantity} ₽
                                    </span>
                                </div>
                            </div>
                        ))
                    }
                    {cartItems.length > 0 && (
                        <div className="order-page__total">
                            Итого: {cartItems.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0)} ₽
                        </div>
                    )}
                </div>

                <button
                    className="order-page__submit"
                    onClick={handleOrder}
                    disabled={!form.name || !form.email || !form.phone || !form.address.city || !form.address.street || !form.address.house}
                >
                    {isCreating ? <Loader/> : 'Оформить заказ'}
                </button>
                <Modal visible={modalOpen} setVisible={open => open ? undefined : closeModal()}>
                    <div className="modal-content-wrapper">
                        <h3>Заказ успешно оформлен.</h3>
                        <p>Вы будете перенаправлены на главную через {countdown} сек. </p>
                        <a onClick={closeModal}>
                            {isCreating ? <Loader/> : 'Перейти сейчас' }
                        </a>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Order;
