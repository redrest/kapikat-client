import React, { FC, useEffect, useState } from 'react';
import { useUser } from '../../context/AuthContext';
import api from '../../api/axios';
import { ICategory, IProduct } from '../../types/types';
import Loader from '../../components/Loader';
import CategoryCard from '../../components/ui/categoryCard/CategoryCard';
import ProductCard from '../../components/ui/productCard/ProductCard';
import Cart from '../../components/ui/cart/Cart';
import {useParams, useNavigate, useSearchParams, Link} from 'react-router-dom';
import './Home.scss';
import Breadcrumbs from "../../components/ui/breadCrumbs/BreadCrumbs";
import {useCartContext} from "../../context/CartContext";
import ProductFilters from "../../components/ui/ProductFilters/ProductFilters";
import Modal from "../../components/ui/modal/Modal";

const Home: FC = () => {
    const [searchParams] = useSearchParams();
    const searchValue = searchParams.get('value') || '';
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<'min' | 'max' | null>(null);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get<{ data: ICategory[] }>('/category');
                setCategories(res.data.data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsCategoriesLoading(false);
            }
        };
        setIsCategoriesLoading(true);
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!categoryId) {
            setSelectedCategory(null);
            setSelectedCategoryName(null);
            return;
        }

        setSelectedCategory(categoryId);
        const sub = categories
            .flatMap(c => c.subcategories || [])
            .find(s => s._id === categoryId);
        setSelectedCategoryName(sub?.name || null);
        setAvailableTags(sub?.filters || []);
        setSelectedTags([]);
        setSelectedSort(null);
    }, [categoryId, categories]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const parts = ['page=1', 'limit=20'];
                if (categoryId) {
                    parts.push(`category=${categoryId}`);
                }
                if (searchValue) {
                    parts.push(`search=${encodeURIComponent(searchValue)}`);
                }
                if (selectedSort) {
                    parts.push(`sort=${selectedSort}`);
                }
                if (selectedTags.length > 0) {
                    parts.push(`filters=${selectedTags.join(',')}`);
                }
                const query = parts.length ? `?${parts.join('&')}` : '';
                const res = await api.get<{ data: { productsObj: IProduct[] } }>(`/products${query}`);
                setProducts(res.data.data.productsObj);
            } catch (error) {
                console.error('Ошибка при загрузке продуктов:', error);
            } finally {
                setIsProductsLoading(false);
            }
        };
        setIsProductsLoading(true);
        fetchProducts();
    }, [categoryId, searchValue, selectedSort, selectedTags]);

    const {
        cartItems,
        cartMap,
        handleAdd,
        handleRemove,
        handleReduce,
        handleClear
    } = useCartContext();

    const handleSortChange = (order: 'min' | 'max') => {
        setSelectedSort(prev => (prev === order ? null : order));
    };

    const handleClearFilters = () => {
        setSelectedTags([]);
        setSelectedSort(null);
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? [] : [tag]
        );
    };


    return (
        <div className="main">
            <div className="main-wrapper">
                <aside className="main__category-list">
                    {categories.map(cat => (
                            <CategoryCard
                                key={cat._id}
                                category={cat}
                                subcategories={cat.subcategories || []}
                                onSelect={id => navigate(`/category/${id}`)}
                                type="small"
                                activeId={selectedCategory}
                            />
                        ))
                    }
                </aside>
                <div className="main__products">
                    <div className="bg-white">
                        <div className="breadcrumbs-sticky">
                            {isCategoriesLoading ? (
                              ''
                            ) : (
                                <Breadcrumbs/>
                            )}
                        </div>
                    </div>
                    <div className="main__products-wrapper">
                        {isProductsLoading
                            ? <Loader/>
                            : selectedCategory ? (
                                <div className="main__products-content">
                                    {selectedCategoryName && (
                                        <h2 className="main__products__title">{selectedCategoryName}</h2>
                                    )}
                                    <ProductFilters
                                        selectedSort={selectedSort}
                                        onSortChange={handleSortChange}
                                        onClearFilters={handleClearFilters}
                                        availableTags={availableTags}
                                        selectedTags={selectedTags}
                                        onTagToggle={handleTagToggle}
                                    />
                                    <div className="main__products-list">
                                        {products.map(p => (
                                            <ProductCard
                                                key={p._id}
                                                product={p}
                                                onAdd={(p) => handleAdd(p)}
                                                onReduce={(p) => handleReduce(p, cartMap[p._id] || 0)}
                                                quantity={cartMap[p._id] || 0}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : searchValue ? (
                                <div className="main__products-content">
                                    <h2 className="main__products__title">Найденные продукты</h2>
                                    <div className="main__products-list">
                                        {products.map(p => (
                                            <ProductCard
                                                key={p._id}
                                                product={p}
                                                onAdd={(p) => handleAdd(p)}
                                                onReduce={(p) => handleReduce(p, cartMap[p._id] || 0)}
                                                quantity={cartMap[p._id] || 0}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="main__products-content">
                                    {categories.map(cat => (
                                        <CategoryCard
                                            key={cat._id}
                                            category={cat}
                                            subcategories={cat.subcategories || []}
                                            onSelect={id => navigate(`/category/${id}`)}
                                            type="big"
                                        />
                                    ))}
                                </div>
                            )
                        }
                    </div>
                </div>

                <aside className="main__cart">
                    <Cart
                        items={cartItems}
                        onAdd={(p) => handleAdd(p)}
                        onRemove={(p) => handleRemove(p)}
                        onReduce={(p) => handleReduce(p, cartMap[p._id] || 0)}
                        onClear={handleClear}
                        onOpenModal={openModal}
                    />
                </aside>
            </div>
            <Modal visible={isModalOpen} setVisible={closeModal}>
                <div className="modal-content-wrapper">
                    <h2>Оформление заказа</h2>
                    <p>Для продолжения необходимо авторизоваться.</p>
                    <Link to="/auth/login" className="modal-auth-link" onClick={() =>closeModal()}>
                        Авторизоваться
                    </Link>
                </div>
            </Modal>
        </div>
    );
};

export default Home;
