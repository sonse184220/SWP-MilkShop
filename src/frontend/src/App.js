// import logo from './logo.svg';
// import './App.css';
// import ProductBar from './components/Product-HomePage/ProductBar.jsx';
// import Header from './components/Header/Header.jsx';
// import Footer from './components/Footer/Footer.jsx';
// import Test from './Test-GetSearchAPI.js';
// import BlogList from './components/Blog/BlogList.jsx';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';

import HomePage from './components/Member/HomePage.jsx';
import AllBlog from './components/Blog/AllBlog.jsx';
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
        {/* Route '/' */}
        <Route path="/" element={!isLogin ? <Login onLogin={handleLogin} showLogin={handleShowLogin} /> : <HomePage onLogin={handleLogin} />} />
        {/* Route '/login-register' */}
        <Route path='/login-register' element={!showLogin ? <Login onLogin={handleLogin} showLogin={handleShowLogin} /> : <Register showLogin={handleShowLogin} />} />
      </Routes>
         {/* Route '/Blogs */}
        <Route path='/Blogs' element={<AllBlog/>}></Route>          
    </Router>
  );
}
export default App;
