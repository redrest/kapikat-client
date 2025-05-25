import React, { FC, useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom';
import './SearchBar.scss';

const SearchBar: FC = () => {
    const [params, setParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname !== '/search') {
            setSearch('');
        }
    }, [pathname]);

    useEffect(() => {
        if (search.length < 3) return;
        const handler = setTimeout(() => {
            if (window.location.pathname === '/search') {
                setParams({ value: search });
            } else {
                navigate(`/search?value=${encodeURIComponent(search)}`);
            }
        }, 1000);

        return () => clearTimeout(handler);
    }, [search, navigate, setParams]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && search.trim()) {
            if (params.get('value') !== search) {
                navigate(`/search?value=${encodeURIComponent(search)}`);
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const clearSearch = () => {
        setSearch('');
    };

    return (
        <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
                type="text"
                placeholder="Поиск товаров..."
                value={search}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {search && (
                <FaTimes
                    className="clear-icon"
                    onClick={clearSearch}
                />
            )}
        </div>
    );
};

export default SearchBar;
