import React, { FC } from 'react';
import { ICategory } from '../../../types/types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loader from "../../../components/Loader";
import '../AdminPage.scss';

interface CategoryTableProps {
    categories: ICategory[];
    isLoading: boolean;
    onEdit: (cat: ICategory) => void;
    onDelete: (id: string) => void;
}

const CategoryTable: FC<CategoryTableProps> = ({ categories, isLoading, onEdit, onDelete }) => {

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
                        <th>Фильтры</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map(cat => (
                        <React.Fragment key={cat._id}>
                            <tr>
                                <td>
                                    <img src={cat.image || ''} alt={cat.name} style={{width: 100}}/>
                                </td>
                                <td>{cat.name}</td>
                                <td>{cat.filters?.join(', ') || '—'}</td>
                                <td>
                                    <button onClick={() => onEdit(cat)}><FaEdit/></button>
                                    {' '}
                                    <button onClick={() => onDelete(cat._id)}><FaTrash/></button>
                                </td>
                            </tr>
                            {cat.subcategories?.map(sub => (
                                <tr key={sub._id}>
                                    <td style={{paddingLeft: 20}}>
                                        <img src={sub.image || ''} alt={sub.name} style={{width: 80}}/>
                                    </td>
                                    <td>{sub.name}</td>
                                    <td>{sub.filters?.join(', ') || '—'}</td>
                                    <td>
                                        <button onClick={() => onEdit(sub)}><FaEdit/></button>
                                        {' '}
                                        <button onClick={() => onDelete(sub._id)}><FaTrash/></button>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            )}
        </div>

    );
};

export default CategoryTable;
