import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';

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
import { OrderHistory } from '../components/OrderHistory/OrderHistory.jsx';

const HomePageWrapper = ({ onLogin, isMember }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // const token = searchParams.get('token');
    const token = searchParams.get('tempUserToken');
    console.log(token);
    // if (token) {
    //     If there's a token, redirect to the registration completion page
    //     navigate('/Customer/complete-registration', { state: { token } });
    // }

    useEffect(() => {
        if (token) {
            // If there's a token, redirect to the registration completion page
            navigate('/Customer/complete-registration', { state: { token } });
        }
    }, [token, navigate]);

    // If there's no token, render the regular HomePage
    return <HomePage onLogin={onLogin} isMember={isMember} />;
};

const TokenHandler = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // const token = searchParams.get('token' || 'tempUserToken');
    const token = searchParams.get('token');
    const tempUserToken = searchParams.get('tempUserToken');

    useEffect(() => {
        if (token) {
            // if (location.pathname === '/Customer/home') {
            // If on the home route with token, redirect to home without token
            navigate('/Customer/home', { state: { token } });
            // }
        } else if (tempUserToken) {
            // If there's a token and not on the home route, redirect to the registration completion page
            navigate('/Customer/complete-registration', { state: { tempUserToken } });
        }
    }, [token, location.pathname, navigate, tempUserToken]);

    return children;
};

const CompleteRegistrationWrapper = () => {
    const location = useLocation();
    const { token } = location.state || {};

    return <Register showLogin={() => { }} isCompleteRegistration={true} token={token} />;
};

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
            <Route index element={<Navigate to="home" />} />
            {/* <Route path='home' element={<HomePage onLogin={handleLogin} isMember={isMember} />} /> */}
            <Route path='home' element={<HomePageWrapper onLogin={handleLogin} isMember={isMember} />} />
            {/* <Route path='home' element={<TokenHandler><HomePage onLogin={handleLogin} isMember={isMember} /></TokenHandler>} /> */}
            <Route path='login-register' element={!showLogin ? <Login onLogin={handleLogin} showLogin={handleShowLogin} /> : <Register showLogin={handleShowLogin} isCompleteRegistration={false} />} />
            <Route path='login-google' element={<div>Hello Google</div>} />
            <Route path='Blogs' element={<AllBlog isMember={isMember} />}></Route>
            <Route path='Products' element={<AllProducts isMember={isMember} />}></Route>
            <Route path='EditProfile' element={<EditProfile isMember={isMember} />}></Route>
            <Route path='ProductDetail/:ProductID' element={<ProductDetail key={Date.now()} isMember={isMember} />}></Route>
            <Route path='Wishlist' element={<Wishlist isMember={isMember} />}></Route>
            <Route path="BlogDetail/:BlogID" element={<BlogDetail isMember={isMember} />} />
            <Route path='Cart' element={<Cart isMember={isMember} />} />
            <Route path='GuestCart' element={<GuestCart />} />
            <Route path='OrderHistory' element={<OrderHistory isMember={isMember} />} />
            {/* <Route path='complete-registration' element={<Register showLogin={handleShowLogin} isCompleteRegistration={true} />} /> */}
            <Route path='complete-registration' element={<CompleteRegistrationWrapper />} />
            {/* <Route path='complete-registration' element={<CompleteRegistrationWrapper />} /> */}
        </Routes>

    )
}