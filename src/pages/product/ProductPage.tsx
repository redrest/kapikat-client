import React, {FC, useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './ProductPage.scss';
import Loader from "../../components/Loader";
import api from "../../api/axios";
import {IProduct} from "../../types/types";
import CartActions from "../../components/ui/cartAction/CartActions";
import Breadcrumbs from "../../components/ui/breadCrumbs/BreadCrumbs";
import {useCartContext} from "../../context/CartContext";

const ProductPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [product, setProduct] = useState<IProduct | null>(null);
    const {productId} = useParams<{ productId: string }>();

    const {
        cartMap,
        handleAdd,
        handleReduce,
    } = useCartContext();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get<{data: IProduct}>(`/products/${productId}`);
                setProduct(res.data.data);
            } catch (e) {
                console.error("Ошибка при получении данных " + e);
            } finally {
                setIsLoading(false);
            }
        }
        setIsLoading(true);
        fetchProduct();
    }, []);

    const quantity = product ? cartMap[product._id] || 0 : 0;

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="product">
                    <div className="product-wrapper">
                        <Breadcrumbs/>
                        {product && (

                            <div className="product__info">
                                <div className="product__image">
                                    <img src={product.image} alt={product.image}/>
                                    {product.discount && (
                                        <div className="product__discount">
                                            -{product.discount}%
                                        </div>
                                    )}
                                </div>
                                <div className="product__details">
                                    <div className="product__title">
                                        <h2 className="product__title__name">{product.name}</h2>
                                        <span className="product__title__weight">{product.weight.value} {product.weight.unit}</span>
                                    </div>
                                    <div className="product__info-blocks">
                                        {product.description && (
                                            <p className="product__description">{product.description}</p>
                                        )}
                                        {product.composition && (
                                            <div className="product__composition">
                                                <h3>Состав</h3>
                                                <p>{product.composition}</p>
                                            </div>
                                        )}
                                        <div className="product__shelfLife">
                                            <h3>Срок годности</h3>
                                            <p>{product.shelfLife.value} <span>{product.shelfLife.unit}.</span></p>
                                        </div>
                                        <div className="product__storage-conditions">
                                            <h3>Условия хранения</h3>
                                            <p>{product.storageConditions}</p>
                                        </div>
                                        {product.manufacturer && (
                                            <div className="product__manufacturer">
                                                <h3>Производитель</h3>
                                                <p>{product.manufacturer}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="product__price">
                                        {product.discount ? (
                                            <div className="product__price-wrapper">
                                                <span className="product__price-new">
                                                    {Math.round(product.price * (1 - product.discount / 100))} ₽
                                                </span>
                                                <span className="product__price-old">
                                                    {product.price} ₽
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="product__price-regular">{product.price} ₽</span>
                                        )}
                                        <CartActions product={product} quantity={quantity}
                                                     onAdd={(p) => handleAdd(p)}
                                                     onReduce={(p) => handleReduce(p, quantity)}
                                                     type={"product-page"}
                                        />
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductPage;
