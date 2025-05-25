import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/AuthContext';
import { ICategory, IProduct } from '../../types/types';
import api from '../../api/axios';
import ProductForm from './productAdmin/ProductForm';
import CategoryForm from './categoryAdmin/CategoryForm';
import Modal from '../../components/ui/modal/Modal';
import ProductTable from './productAdmin/ProductTable';
import CategoryTable from './categoryAdmin/CategoryTable';
import './AdminPage.scss';

const AdminPage = () => {
    const { user } = useUser();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoadingProd, setIsLoadingProd] = useState(true);
    const [isLoadingCat, setIsLoadingCat] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
    const [modalProdVisible, setModalProdVisible] = useState(false);
    const [modalCatVisible, setModalCatVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'products'|'category'>('products');

    const fetchProducts = async () => {
        setIsLoadingProd(true);
        try {
            const parts = ['page=1', 'limit=10'];
            if (searchValue.trim()) {
                parts.push(`search=${encodeURIComponent(searchValue.trim())}`);
            }
            const res = await api.get<{ data: { productsObj: IProduct[] } }>(
                `/products?${parts.join('&')}`
            );
            setProducts(res.data.data.productsObj);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingProd(false);
        }
    };

    const fetchCategories = async () => {
        setIsLoadingCat(true);
        try {
            const qs = searchCategory.trim()
                ? `?search=${encodeURIComponent(searchCategory.trim())}`
                : '';
            const res = await api.get<{ data: ICategory[] }>(`/category${qs}`);
            setCategories(res.data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingCat(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        const t = setTimeout(fetchProducts, 400);
        return () => clearTimeout(t);
    }, [searchValue]);

    useEffect(() => {
        const t = setTimeout(fetchCategories, 400);
        return () => clearTimeout(t);
    }, [searchCategory]);

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('Удалить этот товар?')) return;
        await api.delete(`/products/${id}`);
        fetchProducts();
    };
    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm('Удалить эту категорию?')) return;
        await api.delete(`/category/${id}`);
        fetchCategories();
    };

    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'ADMIN') return <Navigate to="/" />;

    return (
        <div className="admin-page">
            <div className="admin-page-wrapper">
                <h1>Панель администратора</h1>
                <div className="admin-tabs">
                    <button
                        className={activeTab === 'products' ? 'active' : ''}
                        onClick={() => setActiveTab('products')}
                    >
                        Продукты
                    </button>
                    <button
                        className={activeTab === 'category' ? 'active' : ''}
                        onClick={() => setActiveTab('category')}
                    >
                        Категории
                    </button>
                </div>
                {activeTab === 'products' ? (
                    <section className="admin-section">
                        <h2>Продукты</h2>
                        <div className="admin-section__controls">
                            <input
                                type="text"
                                placeholder="Поиск по названию…"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                            <button onClick={() => {
                                setEditingProduct({} as any);
                                setModalProdVisible(true);
                            }}>
                                Новый товар
                            </button>
                        </div>

                        {editingProduct !== null && modalProdVisible && (
                            <Modal visible={modalProdVisible} setVisible={setModalProdVisible}>
                                <ProductForm
                                    product={editingProduct._id ? editingProduct : undefined}
                                    onSaved={() => {
                                        setEditingProduct(null);
                                        fetchProducts();
                                        setModalProdVisible(false);
                                    }}
                                    onCancel={() => setModalProdVisible(false)}
                                />
                            </Modal>
                        )}

                        <ProductTable
                            products={products}
                            isLoading={isLoadingProd}
                            onEdit={prod => {
                                setEditingProduct(prod);
                                setModalProdVisible(true);
                            }}
                            onDelete={handleDeleteProduct}
                        />
                    </section>
                ) : (
                    <section className="admin-section">
                        <h2>Категории</h2>
                        <div className="admin-section__controls">
                            <input
                                type="text"
                                placeholder="Поиск по названию…"
                                value={searchCategory}
                                onChange={e => setSearchCategory(e.target.value)}
                            />
                            <button onClick={() => {
                                setEditingCategory({} as any);
                                setModalCatVisible(true);
                            }}>
                                Новая категория
                            </button>
                        </div>

                        {editingCategory !== null && modalCatVisible && (
                            <Modal visible={modalCatVisible} setVisible={setModalCatVisible}>
                                <CategoryForm
                                    category={editingCategory._id ? editingCategory : undefined}
                                    onSaved={() => {
                                        setEditingCategory(null);
                                        fetchCategories();
                                        setModalCatVisible(false);
                                    }}
                                    onCancel={() => setModalCatVisible(false)}
                                />
                            </Modal>
                        )}

                        <CategoryTable
                            categories={categories}
                            isLoading={isLoadingCat}
                            onEdit={cat => {
                                setEditingCategory(cat);
                                setModalCatVisible(true);
                            }}
                            onDelete={handleDeleteCategory}
                        />
                    </section>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
