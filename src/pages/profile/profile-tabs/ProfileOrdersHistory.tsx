import React, { FC, useEffect, useState } from 'react';
import { useUser } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import {IOrder, IOrderItem, OrderStatusLabels} from '../../../types/types';
import Loader from '../../../components/Loader';
import {useCartContext} from "../../../context/CartContext";

const ProfileOrdersHistory: FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isRepeating, setIsRepeating] = useState<{ [key: string]: boolean }>({});
    const { handleAdd, handleClear } = useCartContext();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get<IOrder[]>('/order');
                setOrders(res.data);
            } catch (e) {
                console.error(e);
                setError('Не удалось загрузить историю заказов');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [user, navigate]);

    const repeatOrder = async (orderId: string, items: IOrderItem[]) => {
        setIsRepeating(prevState => ({ ...prevState, [orderId]: true }));
        try {
            await handleClear();

            const promises = items.map(it => handleAdd(it.product, it.quantity));
            await Promise.all(promises);

            navigate('/order');
        } catch (e) {
            console.error('Ошибка при повторе заказа', e);
            alert('Не удалось повторить заказ');
        } finally {
            setIsRepeating(prev => ({ ...prev, [orderId]: false }));
        }
    };

    return (
        <section className="profile-section">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <h2 className="profile-section__title">История заказов</h2>
                    {orders.length === 0 ? (
                        <p>У вас ещё нет ни одного заказа.</p>
                    ) : (
                        <ul className="order-list">
                            {orders.map(order => (
                                <li key={order._id} className="order-list__item">
                                    <div className="order-list__header">
                                        <span>№ {order._id.slice(1, 6)} </span>
                                        <span>{new Date(order.createdAt!).toLocaleDateString()} </span>
                                        <span>Статус: {OrderStatusLabels[order.status]}</span>
                                    </div>
                                    {order.items.map(item => (
                                        <div key={item.product._id} className="order-list-item">
                                            <div className="order-list__image" >
                                                <img src={item.product.image} alt={item.product.image}/>
                                            </div>
                                            <span className="order-list__name">{item.product.name}</span>
                                            <div className="order-list__price">
                                                <span>{item.quantity} × {item.price} ₽ </span>
                                                <span className="order-list__price--final">
                                                {item.price * item.quantity} ₽
                                            </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="order-list__footer">
                                        <strong>Итого: {order.total} ₽</strong>
                                        <button
                                            className="profile-section__button profile-section__button--active"
                                            onClick={() => repeatOrder(order._id, order.items)}
                                        >
                                            {isRepeating[order._id] ? <Loader/> : 'Повторить заказ'}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </section>
    );
};

export default ProfileOrdersHistory;
