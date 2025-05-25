import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import './Header.scss';
import SearchBar from "../searchBar/SearchBar";
import {FaUser} from "react-icons/fa";
import {GrLogin, GrLogout} from "react-icons/gr";
import {useUser} from "../../../context/AuthContext";
import {useNavigate, useLocation} from "react-router-dom";
import {FiSettings} from "react-icons/fi";
import OrderAlert from "../orderAlert/OrderAlert";
import CartPanel from "../cartPanel/CartPanel";

const Header = () => {
    const { user, logout } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth <= 1200);
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [location]);

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
        navigate("/");
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="header" id="header">
            <div className="container">
                <div className="header__logo">
                    <Link to="/">Kapikat</Link>
                </div>
                <div className="header__search-bar">
                    <SearchBar />
                </div>
                <div className="header__profile">
                    <div className="header__profile__menu">
                        <CartPanel/>
                        {user ? (
                            <>
                                <OrderAlert/>
                                <div className="wrapper"
                                     onMouseEnter={!isMobile ? () => setIsDropdownOpen(true) : undefined}
                                     onMouseLeave={!isMobile ? () => setIsDropdownOpen(false) : undefined}
                                >
                                    <div
                                        onClick={isMobile ? toggleDropdown : undefined}
                                        className="header__profile__menu__user"
                                    >
                                        <FaUser className="header-icon"/>
                                        <span>{user.email}</span>

                                        <div className={`profile-dropdown ${isDropdownOpen ? 'open' : ''}`}>
                                            <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                                                <FaUser className="header-icon"/>
                                                <span>Профиль</span>
                                            </Link>
                                            {user.role === 'ADMIN' && (
                                                <Link to="/admin" onClick={() => setIsDropdownOpen(false)}>
                                                    <FiSettings className="header-icon"/>
                                                    <span>Админ панель</span>
                                                </Link>
                                            )}
                                            <button onClick={handleLogout}>
                                                <GrLogout className="header-icon"/>
                                                <span>Выйти</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link to="/auth/login">
                                <GrLogin className="header-icon"/>
                                <span>Войти</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
