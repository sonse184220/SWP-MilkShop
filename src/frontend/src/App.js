import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';

import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';

import HomePage from './components/Member/HomePage.jsx';
import AllBlog from './components/Blog/AllBlog.jsx';
import AllProducts from './components/Product-HomePage/AllProducts.jsx';
import EditProfile from './components/Member/EditProfile.jsx';
import ProductDetail from './components/Product-Detail/ProductDetail.jsx';
import { Wishlist } from './components/Wishlist/Wishlist.jsx';
import BlogDetail from './components/Blog/BlogDetail';
import { Cart } from './components/Cart/Cart.jsx';
import ProductManagement from './components/Staff/ProductManagement.jsx';
import { CustomerRoutes } from './routes/CustomerRoutes.js';
import { StaffRoutes } from './routes/StaffRoutes.js';
import { AdminRoutes } from './routes/AdminRoutes.js';
//import file bootstrap và material-design-iconic-font trong index.js

// function App() {
//   //state isLogin để chuyển giữa Login.jsx và Homepage.jsx (Route '/')
//   const [isLogin, setIsLogin] = useState(false);
//   const [isMember, setIsMember] = useState(false);

//   const location = useLocation();

//   //state showLogin để chuyển giữa Login.jsx và Register.jsx (Route '/login-register')
//   const [showLogin, setShowLogin] = useState(false);

//   //function để chuyển state isLogin lúc gọi prop
//   const handleLogin = (loginState) => {
//     setIsLogin(loginState);
//   };

//   //function để chuyển state showLogin lúc gọi prop
//   const handleShowLogin = (state) => {
//     setShowLogin(state)
//   };

//   const checkIsMember = () => {
//     const userData = localStorage.getItem('userData');
//     const token = localStorage.getItem('token');
//     if (userData && token) {
//       setIsMember(true);
//     } else {
//       setIsMember(false);
//     }
//   }

//   // useEffect(() => {
//   //   checkIsMember();
//   // }, [])
//   useEffect(() => {
//     checkIsMember();
//   }, [location.pathname])

//   return (
//     <Router>

//       <Routes>
//         {/* <Route path='/' element={<Navigate to={'/login-register'} />} />
//         <Route path='/home' element={<HomePage onLogin={handleLogin} />} />
//         <Route path='/login-register' element={!showLogin ? <Login onLogin={handleLogin} showLogin={handleShowLogin} /> : <Register showLogin={handleShowLogin} />} />
//         <Route path='/login-google' element={<div>Hello Google</div>} />
//         <Route path='/Blogs' element={<AllBlog />}></Route>
//         <Route path='/Products' element={<AllProducts />}></Route>
//         <Route path='/EditProfile' element={<EditProfile />}></Route>
//         <Route path='/ProductDetail/:ProductID' element={<ProductDetail />}></Route>
//         <Route path='/Wishlist' element={<Wishlist />}></Route>
//         <Route path="/BlogDetail/:BlogID" element={<BlogDetail />} />
//         <Route path='/Cart' element={<Cart />} />
//         <Route path='/ProductManagement' element={<ProductManagement />} /> */}
//         <Route path='/Customer/*' element={<CustomerRoutes isMember={isMember} />} />
//         <Route path="*" element={<Navigate to="/Customer" />} />
//       </Routes>

//     </Router>
//   );
// }
// export default App;

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [isLogin, setIsLogin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  const handleLogin = (loginState) => {
    setIsLogin(loginState);
  };

  const handleShowLogin = (state) => {
    setShowLogin(state)
  };

  const checkIsMember = () => {
    const userData = sessionStorage.getItem('userData');
    const token = sessionStorage.getItem('token');
    if (userData && token) {
      setIsMember(true);
      console.log("true");
    } else {
      setIsMember(false);
      console.log("false");
    }
  }

  useEffect(() => {
    checkIsMember();
  }, [location.pathname]) // This will run checkIsMember every time the route changes

  return (
    <Routes>
      <Route path='/Customer/*' element={<CustomerRoutes isMember={isMember} />} />
      <Route path="*" element={<Navigate to="/Customer" />} />
      <Route path='/Staff/*' element={<StaffRoutes />} />
      <Route path='*' element={<Navigate to='/Staff' />} />
      <Route path='/Admin/*' element={<AdminRoutes />} />
      <Route path='*' element={<Navigate to='/Admin' />} />
    </Routes>
  );
}

export default App;