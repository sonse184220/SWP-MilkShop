import React, { useEffect } from 'react';
import './Header.css';
import { Link, useNavigate } from "react-router-dom";


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

    return (
        <header ref={headerRef} class="header-area header-sticky">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <nav class="main-nav">

                            <a href="index.html" class="logo">
                                Milk Shop
                            </a>

                            <ul class="nav">
                                <li class="scroll-to-section"><Link to={'/home'} href="#top" class="active">Home</Link></li>
                                <li><Link to={'/Products'} href="meetings.html">Products</Link></li>
                                <li class="scroll-to-section"><Link to={'/Blogs'} href="#apply">Blogs</Link></li>
                                <li class="has-sub">
                                    <a href="javascript:void(0)">Cart</a>
                                    <ul class="sub-menu">
                                        <li><a href="meetings.html">Wishlist</a></li>
                                        <li><a href="meeting-details.html">Reward Point</a></li>
                                    </ul>
                                </li>
                                <li class="scroll-to-section"><a href="#courses">User1</a></li>
                                <li class="scroll-to-section"><a href="#contact" onClick={showLogin}>Logout</a></li>
                            </ul>
                            <a class='menu-trigger'>
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
