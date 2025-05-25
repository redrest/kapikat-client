import React, { FC, useEffect, useState } from 'react';
import { IProduct, ICategory } from '../../../types/types';
import api from "../../../api/axios";
import './ProductForm.scss';

interface ProductFormProps {
    product?: IProduct;
    onSaved: () => void;
    onCancel: () => void;
}

const ProductForm: FC<ProductFormProps> = ({ product, onSaved, onCancel }) => {
    const isEdit = Boolean(product?._id);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [name, setName] = useState(product?.name ?? '');
    const [description, setDescription] = useState(product?.description ?? '');
    const [composition, setComposition] = useState(product?.composition ?? '');
    const [shelfLifeValue, setShelfLifeValue] = useState(product?.shelfLife.value ?? 0);
    const [shelfLifeUnit, setShelfLifeUnit] = useState<'д'|'м'>(product?.shelfLife.unit ?? 'д');
    const [weightValue, setWeightValue] = useState(product?.weight.value ?? 0);
    const [weightUnit, setWeightUnit] = useState<'г'|'кг'|'шт'|'мл'|'л'>(product?.weight.unit ?? 'г');
    const [storageConditions, setStorageConditions] = useState(product?.storageConditions ?? '');
    const [price, setPrice] = useState(product?.price ?? 0);
    const [categoryId, setCategoryId] = useState(product?.category._id ?? '');
    const [manufacturer, setManufacturer] = useState(product?.manufacturer ?? '');
    const [discount, setDiscount] = useState(product?.discount ?? 0);
    const [filters, setFilters] = useState((product?.filters || []).join(', '));
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        api.get<{ data: ICategory[] }>('/category')
            .then(res => setCategories(res.data.data))
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', name);
        form.append('description', description);
        form.append('composition', composition);
        form.append('shelfLife[value]', shelfLifeValue.toString());
        form.append('shelfLife[unit]', shelfLifeUnit);
        form.append('weight[value]', weightValue.toString());
        form.append('weight[unit]', weightUnit);
        form.append('storageConditions', storageConditions);
        form.append('price', price.toString());
        form.append('category', categoryId);
        form.append('manufacturer', manufacturer);
        if (discount) form.append('discount', discount.toString());
        filters.split(',').map(f => f.trim()).filter(f => f).forEach(f => form.append('filters', f));
        if (imageFile) form.append('image', imageFile);

        if (isEdit) {
            await api.put(`/products/${product!._id}`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            await api.post('/products', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        onSaved();
    };

    return (
        <form className="product-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <h3 className="product-form__title">
                {isEdit ? 'Редактировать товар' : 'Новый товар'}
            </h3>
            <input
                className="product-form__input"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Название"
            />
            <textarea
                className="product-form__textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Описание"
            />
            <textarea
                className="product-form__textarea"
                value={composition}
                onChange={e => setComposition(e.target.value)}
                placeholder="Состав"
            />
            <div className="product-form__row">
                <label className="product-form__label">Срок годности:</label>
                <input
                    className="product-form__input--small"
                    type="number"
                    min="0"
                    value={shelfLifeValue}
                    onChange={e => setShelfLifeValue(+e.target.value)}
                />
                <select
                    className="product-form__select--small"
                    value={shelfLifeUnit}
                    onChange={e => setShelfLifeUnit(e.target.value as any)}
                >
                    <option value="д">дней</option>
                    <option value="м">месяцев</option>
                </select>
            </div>
            <div className="product-form__row">
                <label className="product-form__label">Вес:</label>
                <input
                    className="product-form__input--small"
                    type="number"
                    min="0"
                    value={weightValue}
                    onChange={e => setWeightValue(+e.target.value)}
                />
                <select
                    className="product-form__select--small"
                    value={weightUnit}
                    onChange={e => setWeightUnit(e.target.value as any)}
                >
                    <option value="г">г</option>
                    <option value="кг">кг</option>
                    <option value="шт">шт</option>
                    <option value="мл">мл</option>
                    <option value="л">л</option>
                </select>
            </div>
            <input
                className="product-form__input"
                required
                value={storageConditions}
                onChange={e => setStorageConditions(e.target.value)}
                placeholder="Условия хранения"
            />
            <div className="product-form__row">
                <label className="product-form__label">Цена, ₽</label>
                <input
                    className="product-form__input--small"
                    required
                    type="number"
                    min="0"
                    value={price}
                    onChange={e => setPrice(+e.target.value)}
                    placeholder="Цена, ₽"
                />
            </div>
            <select
                className="product-form__select"
                required
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
            >
                <option value="">— Выберите подкатегорию —</option>
                {categories.flatMap(parent =>
                    parent.subcategories?.map(sub => (
                        <option key={sub._id} value={sub._id}>
                            {parent.name} → {sub.name}
                        </option>
                    )) || []
                )}
            </select>
            <input
                className="product-form__input"
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
                placeholder="Производитель"
            />
            <div className="product-form__row">
                <label className="product-form__label">Скидка, %</label>
                <input
                    className="product-form__input--small"
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={e => setDiscount(+e.target.value)}
                    placeholder="Скидка, %"
                />
            </div>
            <input
                className="product-form__input"
                value={filters}
                onChange={e => setFilters(e.target.value)}
                placeholder="Фильтры, через запятую"
            />
            <input
                className="product-form__file"
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] || null)}
            />
            <div className="product-form__buttons">
                <button type="submit" className="product-form__btn product-form__btn--submit">
                    {isEdit ? 'Сохранить' : 'Создать'}
                </button>
                <button
                    type="button"
                    className="product-form__btn product-form__btn--cancel"
                    onClick={onCancel}
                >
                    Отменить
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
