import React, { useEffect } from 'react';
import './Header.css';
import { NavLink, useNavigate, Link } from "react-router-dom";


//prop onLogin chuyền từ app.js -> HomePage.jsx -> Header.jsx
//dùng để set state isLogin
export function Header({ onLogin }) {
    const navigate = useNavigate();

    const headerRef = React.createRef();

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

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    //Chuyển sang Route('/login-register') lúc bấm nút logout
    const showLogin = (event) => {
        event.preventDefault();
        navigate('/login-register')

    }

    const isActive = (match, location) => {
        return location.pathname === match.pathname;
    };

    return (
        <header ref={headerRef} className="header-area header-sticky">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <nav className="main-nav">

                            <a href="index.html" className="logo">
                                Milk Shop
                            </a>

                            <ul className="nav">
                                <li className="scroll-to-section"><NavLink to={'/home'} href="#top">Home</NavLink></li>
                                <li><NavLink to={'/Products'} href="meetings.html">Products</NavLink></li>
                                <li className="scroll-to-section"><NavLink to={'/Blogs'} href="#apply">Blogs</NavLink></li>
                                <li className="has-sub">
                                    <a href='#'>Cart</a>
                                    <ul className="sub-menu">
                                        <li><a href="meetings.html">Wishlist</a></li>
                                        <li><a href="meeting-details.html">Reward Point</a></li>
                                    </ul>
                                </li>
                                <li className="scroll-to-section"><a href="#courses">User1</a></li>
                                <li className="scroll-to-section"><a href="#contact" onClick={showLogin}>Logout</a></li>
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
