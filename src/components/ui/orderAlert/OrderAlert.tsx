import React, { FC, useEffect, useState } from 'react';
import api from '../../../api/axios';
import { IOrder, OrderStatusLabels } from '../../../types/types';
import { useUser } from '../../../context/AuthContext';
import { FiX } from 'react-icons/fi';
import './OrderAlert.scss';
import {TbTruckDelivery} from "react-icons/tb";

const OrderAlert: FC = () => {
    const { user } = useUser();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [visible, setVisible] = useState(false);

    const fetchLatestOrder = async () => {
        if (!user) return;
        try {
            const res = await api.get<IOrder>('/order/latest');
            if (res.status === 200 && res.data) {
                setOrder(res.data);
            }
        } catch (e) {
            console.error('Ошибка при получении последнего заказа', e);
        }
    }

    useEffect(() => {
        fetchLatestOrder();
    }, [user]);

    const handleCancel = async () => {
        if (!order) return;
        try {
            const res = await api.put<IOrder>(`/order/${order._id}/cancel`);
            if (res.status === 200) {
                setOrder(res.data);
                fetchLatestOrder();
            }
        } catch {
            alert('Не удалось отменить заказ');
        }
    };

    if (!user || !order) return null;

    return (
        <div className="order-alert">
            <button
                className="order-alert__button"
                onClick={() => setVisible(prev => !prev)}
                title="Последний заказ"
            >
                <TbTruckDelivery className="order-alert__icon" />
                <span className="order-alert__badge">{order.items.length}</span>
            </button>
            {visible && (
                <div
                    className={`order-alert__overlay ${visible ? 'visible' : ''}`}
                    onClick={() => setVisible(false)}
                />
            )}
            <div className={`order-alert__panel ${visible ? 'open' : ''}`}>
                <div className="order-alert__panel__header">
                    <h3>Заказ №{order._id.slice(1, 6)}</h3>
                    <button className="order-alert__close" onClick={() => setVisible(false)}>
                        <FiX className="order-alert__icon" />
                    </button>
                </div>

                <div className="order-alert__panel__body">
                    <p><strong>Дата:</strong> {new Date(order.createdAt!).toLocaleString()}</p>
                    <p><strong>Статус:</strong> {OrderStatusLabels[order.status]}</p>
                    <ul className="order-alert__items">
                        {order.items.map(item => (
                            <li key={item.product._id} className="order-alert__items__item">
                                <div className="order-alert__items__image">
                                    <img src={item.product.image} alt={item.product.name} />
                                </div>
                                <span className="order-alert__items__name">{item.product.name}</span>
                                <div className="order-alert__items__price">
                                    <span>{item.quantity} × {item.price} ₽</span>
                                    <span className="order-alert__items__price--final">
                                        {item.price * item.quantity} ₽
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="order-alert__total">
                        <strong>Итого: {order.total} ₽</strong>
                    </div>
                </div>

                <div className="order-alert__panel__footer">
                    <button
                        className="order-alert__action"
                        disabled={order.status !== 'pending'}
                        onClick={handleCancel}
                    >
                        Отменить заказ
                    </button>
                </div>
            </div>

        </div>
    );
};

export default OrderAlert;
