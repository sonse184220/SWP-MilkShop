import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from '../components/Login/Login.jsx';
import Register from '../components/Register/Register.jsx';

import HomePage from '../components/Member/HomePage.jsx';
import AllBlog from '../components/Blog/AllBlog.jsx';
import AllProducts from '../components/Product-HomePage/AllProducts.jsx';
import EditProfile from '../components/Member/EditProfile.jsx';
import ProductDetail from '../components/Product-Detail/ProductDetail.jsx';
import { Wishlist } from '../components/Wishlist/Wishlist.jsx';
import BlogDetail from '../components/Blog/BlogDetail.jsx';
import { Cart } from '../components/Cart/Cart.jsx';
import ProductManagement from '../components/Staff/ProductManagement.jsx';
import { GuestCart } from '../components/Guest/GuestCart.jsx';

export function CustomerRoutes({ isMember }) {
    //state isLogin để chuyển giữa Login.jsx và Homepage.jsx (Route '/')
    const [isLogin, setIsLogin] = useState(false);
    // const [isMember, setIsMember] = useState(false);

    //state showLogin để chuyển giữa Login.jsx và Register.jsx (Route '/login-register')
    const [showLogin, setShowLogin] = useState(false);

    //function để chuyển state isLogin lúc gọi prop
    const handleLogin = (loginState) => {
        setIsLogin(loginState);
    };

    //function để chuyển state showLogin lúc gọi prop
    const handleShowLogin = (state) => {
        setShowLogin(state)
    };
    return (
        <Routes>
            {/* <Route path='/' element={<Navigate to={'/login-register'} />} /> */}
            <Route index element={<Navigate to="login-register" />} />
            <Route path='home' element={<HomePage onLogin={handleLogin} isMember={isMember} />} />
            <Route path='login-register' element={!showLogin ? <Login onLogin={handleLogin} showLogin={handleShowLogin} /> : <Register showLogin={handleShowLogin} />} />
            <Route path='login-google' element={<div>Hello Google</div>} />
            <Route path='Blogs' element={<AllBlog isMember={isMember} />}></Route>
            <Route path='Products' element={<AllProducts isMember={isMember} />}></Route>
            <Route path='EditProfile' element={<EditProfile isMember={isMember} />}></Route>
            <Route path='ProductDetail/:ProductID' element={<ProductDetail isMember={isMember} />}></Route>
            <Route path='Wishlist' element={<Wishlist isMember={isMember} />}></Route>
            <Route path="BlogDetail/:BlogID" element={<BlogDetail isMember={isMember} />} />
            <Route path='Cart' element={<Cart isMember={isMember} />} />
            <Route path='GuestCart' element={<GuestCart />} />
            <Route path='ProductManagement' element={<ProductManagement />} />
        </Routes>

    )
}