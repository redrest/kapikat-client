import React, { FC } from 'react';
import { IProduct } from '../../../types/types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loader from "../../../components/Loader";
import '../AdminPage.scss';

interface ProductTableProps {
    products: IProduct[];
    isLoading: boolean;
    onEdit: (product: IProduct) => void;
    onDelete: (id: string) => void;
}

const ProductTable: FC<ProductTableProps> = ({ products, isLoading, onEdit, onDelete }) => {

    return (
        <div className="table-wrapper">
            {isLoading ? (
                    <Loader/>
                ) : (
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Изображение</th>
                            <th>Название</th>
                            <th>Вес</th>
                            <th>Описание</th>
                            <th>Состав</th>
                            <th>Срок хранения</th>
                            <th>Условия хранения</th>
                            <th>Категория</th>
                            <th>Производитель</th>
                            <th>Цена</th>
                            <th>Скидка</th>
                            <th>Фильтры</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(prod => (
                            <tr key={prod._id}>
                                <td>
                                    <img
                                        src={prod.image}
                                        alt={prod.name}
                                        style={{width: 100}}
                                    />
                                </td>
                                <td>{prod.name}</td>
                                <td>{prod.weight.value} {prod.weight.unit}</td>
                                <td>{prod.description ? prod.description : '—'}</td>
                                <td>{prod.composition? prod.composition : '—'}</td>
                                <td>{prod.shelfLife.value} {prod.shelfLife.unit}</td>
                                <td>{prod.storageConditions}</td>
                                <td>{prod.category.name}</td>
                                <td>{prod.manufacturer ? prod.manufacturer : '—'}</td>
                                <td>{prod.price} ₽</td>
                                <td>{prod.discount ? `${prod.discount}%` : '—'}</td>
                                <td>{prod.filters?.join(', ') || '—'}</td>
                                <td>
                                    <button onClick={() => onEdit(prod)}><FaEdit/></button>
                                    {' '}
                                    <button onClick={() => onDelete(prod._id)}><FaTrash/></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    );
};

export default ProductTable;
