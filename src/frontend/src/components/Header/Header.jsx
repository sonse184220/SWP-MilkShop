import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { NavLink, useNavigate, Link } from "react-router-dom";


//prop onLogin chuyền từ app.js -> HomePage.jsx -> Header.jsx
//dùng để set state isLogin
export function Header({ onLogin }) {
    const navigate = useNavigate();

    const headerRef = useRef(null);
    // const headerRef = React.createRef();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const header = headerRef.current;
            if (header) { // Check if header is not null
                if (window.scrollY > 0) {
                    header.classList.add('background-header');
                } else {
                    header.classList.remove('background-header');
                }
            }
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    //Chuyển sang Route('/login-register') lúc bấm nút logout
    const showLogin = (event) => {
        event.preventDefault();
        navigate('/login-register')

    }

    const isActive = (match, location) => {
        return location.pathname === match.pathname;
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    return (
        <header ref={headerRef} className="header-area header-sticky">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <nav className="main-nav">

                            <a href="" className="logo">
                                Milk Shop
                            </a>

                            <ul className="nav">
                                <li className="scroll-to-section"><NavLink to={'/home'} href="#top">Home</NavLink></li>
                                <li><NavLink to={'/Products'} href="meetings.html">Products</NavLink></li>
                                <li className="scroll-to-section"><NavLink to={'/Blogs'} href="#apply">Blogs</NavLink></li>
                                <li className="scroll-to-section"><NavLink to={'/Wishlist'}> Wishlist</NavLink></li>
                                <li className="scroll-to-section"><NavLink to={'/Cart'}> Cart</NavLink></li>
                                {/* <li className="has-sub">
                                    <a href='#'>Cart</a>
                                    <ul className="sub-menu">
                                        <li><a href="meetings.html">Wishlist</a></li>
                                        <li><a href="meeting-details.html">Reward Point</a></li>
                                    </ul>
                                </li> */}
                                {/* <li className="scroll-to-section"><a href="#courses">User1</a></li>
                                <li className="scroll-to-section"><a href="#contact" onClick={showLogin}>Logout</a></li> */}
                                <li className="user-dropdown" ref={dropdownRef}>
                                    <div className="profile-image" onClick={toggleDropdown}>
                                        <img src="/img/user.png" alt="User" />
                                    </div>
                                    <ul className={`header-dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                        <li><button onClick={() => { navigate('/EditProfile') }}>View Profile</button></li>
                                        <li><button onClick={showLogin}>Logout</button></li>
                                    </ul>
                                </li>
                            </ul>
                            <a className='menu-trigger'>
                                <span>Menu</span>
                            </a>

                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
export default Header;
