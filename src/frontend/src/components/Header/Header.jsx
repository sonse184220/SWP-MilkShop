import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { NavLink, useNavigate, Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";


//prop onLogin chuyền từ app.js -> HomePage.jsx -> Header.jsx
//dùng để set state isLogin
export function Header({ onLogin, isMember }) {
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
        sessionStorage.clear();
        navigate('/Customer/home')
        window.location.reload();
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
                                Milky Way
                            </a>

                            <ul className="nav">
                                <li className="scroll-to-section"><NavLink to={'/Customer/home'} href="#top">Home</NavLink></li>
                                <li><NavLink to={'/Customer/Products'} href="">Products</NavLink></li>
                                <li className="scroll-to-section"><NavLink to={'/Customer/Blogs'} href="#apply">Blogs</NavLink></li>
                                {/* <li className="scroll-to-section"><NavLink to={'/Customer/Wishlist'}> Wishlist</NavLink></li>
                                <li className="scroll-to-section"><NavLink to={'/Customer/Cart'}> Cart</NavLink></li> */}
                                {isMember && (<><li className="scroll-to-section"><NavLink to={'/Customer/Wishlist'}> Wishlist</NavLink></li>
                                </>)}
                                <li className="scroll-to-section"><NavLink to={isMember ? '/Customer/Cart' : '/Customer/GuestCart'}> Cart</NavLink></li>
                                {/* <li className="has-sub">
                                    <a href='#'>Cart</a>
                                    <ul className="sub-menu">
                                        <li><a href="meetings.html">Wishlist</a></li>
                                        <li><a href="meeting-details.html">Reward Point</a></li>
                                    </ul>
                                </li> */}
                                {/* <li className="scroll-to-section"><a href="#courses">User1</a></li>
                                <li className="scroll-to-section"><a href="#contact" onClick={showLogin}>Logout</a></li> */}
                                {/* <li className="user-dropdown" ref={dropdownRef}>
                                    <div className="profile-image" onClick={toggleDropdown}>
                                        <img src="/img/user.png" alt="User" />
                                    </div>
                                    <ul className={`header-dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                        <li><button onClick={() => { navigate('/Customer/EditProfile') }}>View Profile</button></li>
                                        <li><button onClick={showLogin}>Logout</button></li>
                                    </ul>
                                </li> */}
                                {isMember ? (
                                    <li className="user-dropdown" ref={dropdownRef}>
                                        <div className="profile-image" onClick={toggleDropdown}>
                                            <img src="/img/user.png" alt="User" />
                                        </div>
                                        <ul className={`header-dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                            <li><button onClick={() => { navigate('/Customer/EditProfile') }}>View Profile</button></li>
                                            <li><button onClick={() => { navigate('/Customer/OrderHistory') }} >Purchase History</button></li>
                                            <li><button onClick={showLogin}>Logout</button></li>
                                        </ul>
                                    </li>
                                ) : (
                                    <li className="scroll-to-section"><NavLink to={'/Customer/login-register'}>Login/Register <FaSignInAlt style={{ marginBottom: '4px' }} /></NavLink></li>
                                )}
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
