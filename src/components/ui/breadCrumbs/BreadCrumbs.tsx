import React, { FC, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import api from '../../../api/axios';
import './BreadCrumbs.scss';

interface Crumb {
    name: string;
    path?: string;
}

const Breadcrumbs: FC = () => {
    const location = useLocation();
    const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const createBreadcrumbs = async () => {
            setLoading(true);
            const pathParts = location.pathname.split('/').filter(Boolean);
            const crumbs: Crumb[] = [];
            crumbs.push({ name: 'Главная', path: '/' });

            for (let i = 0; i < pathParts.length; i++) {
                const part = pathParts[i];

                if (part === 'category' && pathParts[i + 1]) {
                    try {
                        const res = await api.get(`/category/${pathParts[i + 1]}`);
                        const category = res.data;
                        let parentCrumb: Crumb | null = null;

                        if (category.parent) {
                            try {
                                const parentRes = await api.get(`/category/${category.parent}`);
                                parentCrumb = {
                                    name: parentRes.data.name,
                                    path: `/category`,
                                };
                            } catch {
                                parentCrumb = { name: 'Родительская категория' };
                            }
                        }

                        if (parentCrumb) crumbs.push(parentCrumb);
                        crumbs.push({ name: category.name });

                    } catch {
                        crumbs.push({ name: 'Категория' });
                    }
                    break;
                }

                if (part === 'products' && pathParts[i + 1]) {
                    try {
                        const res = await api.get(`/products/${pathParts[i + 1]}`);
                        const product = res.data.data;
                        const categoryRes = await api.get(`/category/${product.category._id}`);
                        const category = categoryRes.data;

                        let parentCrumb: Crumb | null = null;
                        if (category.parent) {
                            try {
                                const parentRes = await api.get(`/category/${category.parent}`);
                                parentCrumb = {
                                    name: parentRes.data.name,
                                    path: `/category`,
                                };
                            } catch {
                                parentCrumb = { name: 'Родительская категория' };
                            }
                        }

                        if (parentCrumb) crumbs.push(parentCrumb);
                        crumbs.push({
                            name: category.name,
                            path: `/category/${category._id}`,
                        });
                        crumbs.push({ name: product.name });

                    } catch {
                        crumbs.push({ name: 'Продукт' });
                    }
                    break;
                }

                if (part === 'profile') {
                    crumbs.push({ name: 'Профиль' });
                }

                if (part === 'search') {
                    crumbs.push({ name: 'Поиск' });
                }

                if(part === 'order') {
                    crumbs.push({name: 'Заказ'});
                }
            }

            setBreadcrumbs(crumbs);
            setLoading(false);
        };

        createBreadcrumbs();
    }, [location]);

    return (
        <div className="breadcrumbs">
            {breadcrumbs.map((crumb, index) => (
                <span key={index}>
                    {crumb.path && !(index === breadcrumbs.length - 1) ? (
                        <Link to={crumb.path}>{crumb.name}</Link>
                    ) : (
                        <span className="current">{crumb.name}</span>
                    )}
                </span>
            ))}
        </div>
    );
};

export default Breadcrumbs;
