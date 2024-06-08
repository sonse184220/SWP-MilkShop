import React from 'react';
import './Header.css';
import { useNavigate } from "react-router-dom";


//prop onLogin chuyền từ app.js -> HomePage.jsx -> Header.jsx
//dùng để set state isLogin
export function Header({ onLogin }) {
    const navigate = useNavigate();

    //Chuyển sang Route('/login-register') lúc bấm nút logout
    const showLogin = (event) => {
        event.preventDefault();
        navigate('/login-register')

    }

    return (
        <header class="header-area header-sticky">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <nav class="main-nav">

                            <a href="index.html" class="logo">
                                Milk Shop
                            </a>

                            <ul class="nav">
                                <li class="scroll-to-section"><a href="#top" class="active">Home</a></li>
                                <li><a href="meetings.html">Products</a></li>
                                <li class="scroll-to-section"><a href="#apply">Blogs</a></li>
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
