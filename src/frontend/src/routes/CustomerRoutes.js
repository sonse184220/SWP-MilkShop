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
import { GuestCart } from '../components/Guest/GuestCart.jsx';
import { OrderHistory } from '../components/OrderHistory/OrderHistory.jsx';
import { QR } from '../components/QR/QR.jsx';
import { Report } from '../components/Report/Report.jsx';

const TokenHandler = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const tempUserToken = searchParams.get('tempUserToken');

    useEffect(() => {
        if (token) {

            console.log('home token')
            // sessionStorage.setItem('token', token);
            navigate('/Customer/home', { replace: true, state: { token } });
        } else if (tempUserToken) {

            // sessionStorage.setItem('tempUserToken', tempUserToken);
            navigate('/Customer/complete-registration', { replace: true, state: { tempUserToken, showLoginSuccess: true } });
            console.log('complete token')
        }
    }, [token, tempUserToken, navigate, location.pathname]);

    return children;
};

const HomePageWrapper = ({ onLogin, isMember }) => {
    const location = useLocation();
    const token = location.state?.token || sessionStorage.getItem('token');
    return <HomePage onLogin={onLogin} isMember={isMember} token={token} />;
};

const CompleteRegistrationWrapper = ({ showLogin }) => {
    const location = useLocation();
    const tempUserToken = location.state?.tempUserToken || sessionStorage.getItem('tempUserToken');
    return <Register showLogin={showLogin} isCompleteRegistration={true} tempUserToken={tempUserToken} />;
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
            {/* <Route element={<TokenHandler />}> */}
            {/* <Route path='/' element={<Navigate to={'/login-register'} />} /> */}
            {/* <Route index element={<Navigate to="home" />} /> */}
            <Route index element={<Navigate to="/Customer/home" replace />} />
            {/* <Route path='home' element={<HomePage onLogin={handleLogin} isMember={isMember} />} /> */}
            {/* <Route path='home' element={<HomePageWrapper onLogin={handleLogin} isMember={isMember} />} /> */}
            {/* <Route path='home' element={<TokenHandler><HomePage onLogin={handleLogin} isMember={isMember} /></TokenHandler>} /> */}
            <Route path="home" element={<TokenHandler><HomePageWrapper onLogin={handleLogin} isMember={isMember} /></TokenHandler>} />
            <Route path="complete-registration" element={<TokenHandler><CompleteRegistrationWrapper /></TokenHandler>} />

            {/* <Route path='home' element={<HomePage onLogin={handleLogin} isMember={isMember} />} /> */}
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
            <Route path='QRBanking' element={<QR isMember={isMember} />} />
            <Route path='ReportHistory' element={<Report isMember={isMember} />} />
            {/* <Route path='complete-registration' element={<Register showLogin={handleShowLogin} isCompleteRegistration={true} />} /> */}
            {/* <Route path='complete-registration' element={<CompleteRegistrationWrapper />} /> */}
            {/* <Route path='complete-registration' element={<CompleteRegistrationWrapper />} /> */}

            {/* </Route> */}
        </Routes>

    )
}