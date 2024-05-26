import React from 'react';
import './index.css';
export function Header() {
    return (
        <header>
            <div className="header-content">
                <h3 className="site-name"><a href="index.html">Home</a></h3>
                <nav className="navigate-content">
                    <a href="#">Milk-Type</a>
                    <a href="#">Blog</a>
                    <button onClick={() => ('/sign-up')}>Sign up</button>
                    <button onClick={() => ('/login')}>Login</button>
                </nav>
            </div>
            <hr />
        </header>
    );
}
export default Header;
