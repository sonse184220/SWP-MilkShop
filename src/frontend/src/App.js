// import logo from './logo.svg';
// import './App.css';
import Header from './Header/Header.jsx';
import Footer from './Footer/Footer.jsx';
// import Test from './Test-GetSearchAPI.js';
import BlogList from './Blog/BlogList.jsx';
import { useState } from 'react';
import Login from './Login/Login.jsx';
import ProductBar from './Product-HomePage/ProductBar.jsx';
import HomePage from './Member/HomePage.jsx';

function App() {
  const [isLogin, setIsLogin] = useState(false)

  const handleLogin = () => {
    setIsLogin(true)
  }

  return (
    <>
      {!isLogin && <Login onLogin={handleLogin} />}

      {isLogin && (
        <HomePage />
      )
      }

    </>

  );
}

export default App;
