import React, { FC, useEffect, useState } from 'react';
import { ICategory } from '../../../types/types';
import api from "../../../api/axios";
import './CategoryForm.scss';

interface CategoryFormProps {
    category?: ICategory;
    onSaved: () => void;
    onCancel: () => void;
}

const CategoryForm: FC<CategoryFormProps> = ({ category, onSaved, onCancel }) => {
    const isEdit = Boolean(category?._id);
    const [name, setName] = useState(category?.name ?? '');
    const [parentId, setParentId] = useState(category?.parent ?? '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [filters, setFilters] = useState((category?.filters || []).join(', '));
    useEffect(() => {
        api.get<{ data: ICategory[] }>('/category')
            .then(res => setCategories(res.data.data))
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        form.append('name', name);
        if (parentId) form.append('parent', parentId);
        if (imageFile) form.append('image', imageFile);
        filters.split(',').map(f => f.trim()).filter(f => f).forEach(f => form.append('filters', f));
        if (isEdit) {
            await api.put(`/category/${category!._id}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            await api.post('/category', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        onSaved();
    };

    return (
        <form className="category-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <h3 className="category-form__title">
                {isEdit ? 'Редактировать категорию' : 'Новая категория'}
            </h3>
            <input
                className="category-form__input"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Название категории"
            />
            <select
                className="category-form__select"
                value={parentId}
                onChange={e => setParentId(e.target.value)}
            >
                <option value="">— Без родителя —</option>
                {categories.map(c => (
                    <option key={c._id} value={c._id}>
                        {c.name}
                    </option>
                ))}
            </select>
            {parentId && (
                <input
                    className="category-form__input"
                    value={filters}
                    onChange={e => setFilters(e.target.value)}
                    placeholder="Фильтры, через запятую"
                />
            )}

            <input
                className="category-form__file"
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] || null)}
            />
            <div className="category-form__buttons">
                <button type="submit" className="category-form__btn category-form__btn--submit">
                    {isEdit ? 'Сохранить' : 'Создать'}
                </button>
                <button
                    type="button"
                    className="category-form__btn category-form__btn--cancel"
                    onClick={onCancel}
                >
                    Отменить
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;
