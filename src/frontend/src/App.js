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


function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (loginState) => {
    setIsLogin(loginState);
  };

  const handleShowLogin = (state) => {
    setShowLogin(state)
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isLogin ? <Login onLogin={handleLogin} /> : <HomePage onLogin={handleLogin} />} />
        <Route path='/login-register' element={!showLogin ? <Login onLogin={handleLogin} showLogin={handleShowLogin} /> : <Register showLogin={handleShowLogin} />} />
      </Routes>
    </Router>
  );
}
export default App;
