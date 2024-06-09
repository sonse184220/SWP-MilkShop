import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';

import HomePage from './components/Member/HomePage.jsx';
import AllBlog from './components/Blog/AllBlog.jsx';
import AllProducts from './components/Product-HomePage/AllProducts.jsx';
import EditProfile from './components/Member/EditProfile.jsx';
import ProductDetail from './components/Product-Detail/ProductDetail.jsx';

//import file bootstrap và material-design-iconic-font trong index.js

function App() {
  //state isLogin để chuyển giữa Login.jsx và Homepage.jsx (Route '/')
  const [isLogin, setIsLogin] = useState(false);

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
    <Router>
      <Routes>
        <Route path="/" element={!isLogin ? <Login onLogin={handleLogin} showLogin={handleShowLogin} /> : <HomePage onLogin={handleLogin} />} />
        <Route path='/login-register' element={!showLogin ? <Login onLogin={handleLogin} showLogin={handleShowLogin} /> : <Register showLogin={handleShowLogin} />} />
        <Route path='/Blogs' element={<AllBlog />}></Route>
        <Route path='/Products' element={<AllProducts />}></Route>
        <Route path='/EditProfile' element={<EditProfile />}></Route>
        <Route path='/ProductDetail' element={<ProductDetail />}></Route>
      </Routes>

    </Router>
  );
}
export default App;
