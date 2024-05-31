// import logo from './logo.svg';
// import './App.css';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
// import Test from './Test-GetSearchAPI.js';
import BlogList from './components/Blog/BlogList.jsx';
import { useState } from 'react';
import Login from './components/Login/Login.jsx';
import ProductBar from './components/Product-HomePage/ProductBar.jsx';
import HomePage from './components/Member/HomePage.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const handleLogin = (loginState) => {
    setIsLogin(loginState);
  };

  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login onLogin={handleLogin} />} /> */}

        <Route path="/" element={!isLogin ? <HomePage onLogin={handleLogin} /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}
export default App;
